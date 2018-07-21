'use strict'

const { get } = require('lodash')

const { addErrorHandler } = require('../errors')
const { crawl, promiseThen, promiseAllThen } = require('../utils')

const { parseHelper, parseEscape } = require('./parse')
const { checkRecursion } = require('./recursion')
const { helperHandler } = require('./error')

// Evaluate helpers values
const substituteHelpers = function(value, data = {}, opts = {}) {
  const recursive = recursiveSubstitute.bind(null, data, opts)
  const optsA = { ...opts, data, recursive }

  return crawl(value, evalNode, { info: optsA })
}

// Recursive calls, done automatically when evaluating `$$name`
const recursiveSubstitute = function(data, opts, value) {
  return substituteHelpers(value, data, opts)
}

// Evaluate an object or part of an object for helpers
const evalNode = function(value, path, opts) {
  const helper = parseHelper(value)
  // There is no helper
  if (helper === undefined) {
    return value
  }

  const { type } = helper

  if (type === 'concat') {
    return evalConcat({ helper, opts, path })
  }

  return eEvalHelperNode({ helper, opts, value, path })
}

// Evaluate `$$name` when it's inside a string.
// Its result will be transtyped to string and concatenated.
const evalConcat = function({ helper: { tokens }, opts, path }) {
  const maybePromises = tokens.map(token => evalConcatToken({ token, opts, path }))
  // There can be several `$$name` inside a string, in which case they are
  // evaluated in parallel
  return promiseAllThen(maybePromises, concatTokens)
}

const evalConcatToken = function({ token, token: { type, name }, opts, path }) {
  // Parts between `$$name` have `type: 'raw'`
  if (type === 'raw') {
    return name
  }

  return eEvalHelperNode({ helper: token, opts, value: name, path })
}

// `tokens` are joined.
// They will be implicitely transtyped to `String`. We do not use
// `JSON.stringify()` because we want to be format-agnostic.
// `undefined` values will be omitted.
const concatTokens = function(tokens) {
  return tokens.join('')
}

const evalHelperNode = function({ helper, opts }) {
  const unescapedValue = parseEscape({ helper })
  // There was something that looked like a helper but was an escaped value
  if (unescapedValue !== undefined) {
    return unescapedValue
  }

  // Check for infinite recursions
  const optsA = checkRecursion({ helper, opts })

  const { value, propPath } = getHelperValue({ helper, opts: optsA })

  // Unkwnown helpers or helpers with `undefined` values return `undefined`,
  // instead of throwing an error. This allows users to use dynamic helpers, where
  // some properties might be defined or not.
  if (value === undefined) {
    return
  }

  // `$$name` can be an async function, fired right away
  return promiseThen(value, valueA =>
    getHelperProp({ value: valueA, helper, opts: optsA, propPath }),
  )
}

const eEvalHelperNode = addErrorHandler(evalHelperNode, helperHandler)

// Retrieve helper's top-level value
const getHelperValue = function({ helper, helper: { name }, opts: { data } }) {
  const { topName, propPath } = parseName({ name })

  const value = data[topName]

  const valueA = evalFunction({ value, helper, propPath })

  return { value: valueA, propPath }
}

// `$$name` and `{ $$name: arg }` can both use dot notations.
// The top-level value is first evaluated (including recursively parsing its
// helpers) then the rest of the property path is applied.
const parseName = function({ name }) {
  // Dot notation can also use brackets
  const index = name.search(/[.[]/)
  if (index === -1) {
    return { topName: name }
  }

  const topName = name.slice(0, index)

  const delimIndex = getDelimIndex({ name, index })
  const propPath = name.slice(delimIndex)

  return { topName, propPath }
}

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
const evalFunction = function({ value, helper, propPath }) {
  if (!shouldFireFunction({ value, helper, propPath })) {
    return value
  }

  return value()
}

const shouldFireFunction = function({ value, helper: { type }, propPath }) {
  return (
    typeof value === 'function' &&
    // Do not fire when the function is also used as an object.
    // This is for example how Lodash main object works.
    Object.keys(value).length === 0 &&
    // `{ $$func: arg }` should be fired with the argument, not right away.
    // But when using `{ $$func.then.another.func: arg }`, the first `func`
    // should be fired right away, but not the last one.
    !(type === 'function' && propPath === undefined)
  )
}

// Retrieve helper's non-top-level value (i.e. property path)
const getHelperProp = function({ value, helper, opts: { recursive }, propPath }) {
  // An helper `$$name` can contain other helpers, which are then processed
  // recursively.
  // This can be used e.g. to create aliases.
  // This is done only on `$$name` but not `{ $$name: arg }` return value because:
  //  - in functions, it is most likely not the desired intention of the user
  //  - it would require complex escaping (if user does not desire recursion)
  //    E.g. `{ $$identity: { $$identity: $$$$name } }` -> `{ $$identity: $$$name }` -> `$$name`
  const valueA = recursive(value)

  return promiseThen(valueA, valueB => evalHelperProp({ value: valueB, helper, propPath }))
}

const evalHelperProp = function({ value, helper: { type, arg }, propPath }) {
  const valueA = getProp({ value, propPath })

  // Including `undefined`
  if (type !== 'function') {
    return valueA
  }

  // Can use `{ $$helper: [...] }` to pass several arguments to the helper
  // E.g. `{ $$myFunc: [1, 2] }` will fire `$$myFunc(1, 2)`
  const args = Array.isArray(arg) ? arg : [arg]
  // Fire helper when it's a function `{ $$name: arg }`
  // To pass more arguments, e.g. helpers options, helpers `data` functions must be bound.
  // E.g. a library providing helpers could provide a factory function.
  return valueA(...args)
}

const getProp = function({ value, propPath }) {
  if (propPath === undefined) {
    return value
  }

  return get(value, propPath)
}

module.exports = {
  substituteHelpers,
}
