/* eslint-disable-line max-lines */
import { get } from 'lodash'

import { crawl } from '../utils/crawl.js'
import { promiseThen, promiseAllThen } from '../utils/promise.js'

import { parseTemplate, parseEscape } from './parse.js'
import { checkRecursion } from './recursion.js'
import { templateHandler } from './error.js'

// This is a data templating system.
// As opposed to most other templating system, it works over (parsed) data
// instead of (serialized) strings.
// Advantages include:
//  - guarantees serialized data is still valid
//     - e.g. Handlebars producing JSON output might not be valid JSON itself
//  - complex arguments are readable
//  - format-agnostic
//     - e.g. `jsonnet` cannot be used with YAML
//  - handles circular references
//  - handles non serializable types (e.g. sockets)
// Beyond being data-centered, this templating system:
//  - has simple syntax, to keep it truly declarative
//     - no operators, variables scoping, references, inline functions
//  - only includes templating features
//     - no comments, string escaping, text blocks
// `undefined` values are not treated differently than other values.

// Evaluate template
// eslint-disable-next-line max-params
export const evalTemplate = function(data, vars = {}, opts = {}, stack) {
  const recursive = recursiveEval.bind(null, vars, opts)
  const optsA = { ...opts, vars, stack, recursive }

  return crawl(data, evalNode.bind(null, optsA))
}

// Recursive calls, done automatically when evaluating `$$name`
// eslint-disable-next-line max-params
const recursiveEval = function(vars, opts, stack, data) {
  return evalTemplate(data, vars, opts, stack)
}

// Evaluate templates in an object or part of an object
const evalNode = function(opts, data, path) {
  const template = parseTemplate(data)

  // There are no template markers
  if (template === undefined) {
    return data
  }

  const { type } = template

  if (type === 'concat') {
    return evalConcat({ template, opts, path })
  }

  return evalSingle({ template, opts, data, path })
}

// Evaluate `$$name` when it's inside a string.
// Its result will be transtyped to string and concatenated.
const evalConcat = function({ template: { tokens }, opts, path }) {
  const maybePromises = tokens.map(token =>
    evalConcatToken({ token, opts, path }),
  )
  // There can be several `$$name` inside a string, in which case they are
  // evaluated in parallel
  return promiseAllThen(maybePromises, concatTokens)
}

const evalConcatToken = function({ token, token: { type, name }, opts, path }) {
  // Parts between `$$name` have `type: 'raw'`
  if (type === 'raw') {
    return name
  }

  return evalSingle({ template: token, opts, data: name, path })
}

// `tokens` are joined.
// They will be implicitely transtyped to `String`. We do not use
// `JSON.stringify()` because we want to be format-agnostic.
// `undefined` values will be omitted.
const concatTokens = function(tokens) {
  return tokens.join('')
}

const evalSingle = function({ template, opts }) {
  const unescapedData = parseEscape({ template })

  // There was something that looked like a template but was an escaped data
  if (unescapedData !== undefined) {
    return unescapedData
  }

  // Check for infinite recursions
  const optsA = checkRecursion({ template, opts })

  const { data, propPath } = getTopLevelProp({ template, opts: optsA })

  // Unkwnown templates or templates with `undefined` values return `undefined`,
  // instead of throwing an error. This allows using dynamic templates, where
  // some properties might be defined or not.
  if (data === undefined) {
    return
  }

  return evalSingleData({ template, opts: optsA, data, propPath })
}

const evalSingleData = function({ template, opts, data, propPath }) {
  // `$$name` can be an async function, fired right away
  try {
    const retVal = promiseThen(data, dataA =>
      getNestedProp({ data: dataA, template, opts, propPath }),
    )
    // eslint-disable-next-line promise/prefer-await-to-then
    return retVal && typeof retVal.then === 'function'
      ? retVal.catch(error => templateHandler(error, { template }))
      : retVal
  } catch (error) {
    templateHandler(error, { template })
  }
}

// Retrieve template's top-level value
const getTopLevelProp = function({
  template,
  template: { name },
  opts: { vars },
}) {
  const { topName, propPath } = parseName({ name })

  const data = vars[topName]

  const dataA = evalFunction({ data, template, propPath })

  return { data: dataA, propPath }
}

// `$$name` and `{ $$name: arg }` can both use dot notations.
// The top-level value is first evaluated (including recursively parsing its
// templates) then the rest of the property path is applied.
const parseName = function({ name }) {
  const index = name.search(BRACKETS_REGEXP)

  if (index === -1) {
    return { topName: name }
  }

  const topName = name.slice(0, index)

  const delimIndex = getDelimIndex({ name, index })
  const propPath = name.slice(delimIndex)

  return { topName, propPath }
}

// Dot notation can also use brackets
const BRACKETS_REGEXP = /[.[]/u

// Brackets are kept but not dots (because of how `_.get()` works)
const getDelimIndex = function({ name, index }) {
  if (name[index] === '[') {
    return index
  }

  return index + 1
}

// If `$$name` (but not `{ $$name: arg }`) is a function, it is evaluated right
// away with no arguments
// It can be an async function.
const evalFunction = function({ data, template, propPath }) {
  if (!shouldFireFunction({ data, template, propPath })) {
    return data
  }

  return data()
}

const shouldFireFunction = function({ data, template: { type }, propPath }) {
  return (
    typeof data === 'function' &&
    // Do not fire when the function is also used as an object.
    // This is for example how Lodash main object works.
    Object.keys(data).length === 0 &&
    // `{ $$func: arg }` should be fired with the argument, not right away.
    // But when using `{ $$func.then.another.func: arg }`, the first `func`
    // should be fired right away, but not the last one.
    !(type === 'function' && propPath === undefined)
  )
}

// Retrieve template's nested value (i.e. property path)
const getNestedProp = function({
  data,
  template,
  opts: { recursive },
  propPath,
}) {
  // A template `$$name` can contain other templates, which are then processed
  // recursively.
  // This can be used e.g. to create aliases.
  // This is done only on `$$name` but not `{ $$name: arg }` return value
  // because:
  //  - in functions, it is most likely not the desired intention of the user
  //  - it would require complex escaping (if user does not desire recursion)
  //    E.g. `{ $$identity: { $$identity: $$$$name } }` ->
  //    `{ $$identity: $$$name }` -> `$$name`
  const dataA = recursive(data)

  return promiseThen(dataA, dataB =>
    evalNestedProp({ data: dataB, template, propPath }),
  )
}

const evalNestedProp = function({ data, template: { type, arg }, propPath }) {
  const dataA = getProp({ data, propPath })

  // Including `undefined`
  if (type !== 'function') {
    return dataA
  }

  // Can use `{ $$name: [...] }` to pass several arguments to the template
  // function.
  // E.g. `{ $$myFunc: [1, 2] }` will fire `$$myFunc(1, 2)`
  const args = Array.isArray(arg) ? arg : [arg]
  // Fire template when it's a function `{ $$name: arg }`
  // To pass more arguments, e.g. options, template functions must be bound.
  // E.g. a library providing templates could provide a factory function.
  return dataA(...args)
}

const getProp = function({ data, propPath }) {
  if (propPath === undefined) {
    return data
  }

  return get(data, propPath)
}
