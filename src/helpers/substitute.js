'use strict'

const { get } = require('lodash')

const { addErrorHandler } = require('../errors')
const { crawl, promiseThen, promiseAllThen } = require('../utils')

const { parseHelper, parseEscape } = require('./parse')
const { checkRecursion } = require('./recursion')
const { helperHandler } = require('./error')

// Crawl a value recursively to find helpers.
// When an helper is found, it is replaced by its evaluated value.
const substituteHelpers = function(value, data = {}, opts = {}) {
  const recursive = recursiveSubstitute.bind(null, data, opts)

  // Context passed as argument to helper functions
  const context = { ...opts.context, helpers: recursive }

  const optsA = { ...opts, context, data, recursive }

  return crawl(value, evalNode, { info: optsA })
}

// Recursive calls, either:
//  - done automatically when evaluating `$$name`
//  - on recursive helpers using `context.helpers()`
const recursiveSubstitute = function(data, opts, value, dataOverride, { path = [] } = {}) {
  // Reset `opts.path` to recursive calls
  return substituteHelpers(value, { ...data, ...dataOverride }, { ...opts, path })
}

// Evaluate an object or part of an object for helpers
const evalNode = function(value, path, opts) {
  const optsA = appendPath({ opts, path })

  const helper = parseHelper(value)
  // There is no helper
  if (helper === undefined) {
    return value
  }

  if (helper.type === 'concat') {
    return evalConcat({ helper, opts: optsA })
  }

  return evalHelperNode({ helper, opts: optsA })
}

// `path` is the attribute's path within `value`
// Can use `opts.path` to prepend to it
// Set to `error.property`
const appendPath = function({ opts, opts: { path: optsPath = [] }, path }) {
  return { ...opts, path: [...optsPath, ...path] }
}

// Evaluate `$$name` when it's inside a string.
// Its result will be transtyped to string and concatenated.
const evalConcat = function({ helper: { tokens }, opts }) {
  const maybePromises = tokens.map(token => evalConcatToken({ token, opts }))
  // There can be several `$$name` inside a string, in which case they are
  // evaluated in parallel
  return promiseAllThen(maybePromises, concatTokens)
}

const evalConcatToken = function({ token, token: { type, name }, opts }) {
  // Parts between `$$name` have `type: 'raw'`
  if (type === 'raw') {
    return name
  }

  return evalHelperNode({ helper: token, opts })
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

  const valueA = evalHelper({ helper, opts: optsA })
  return valueA
}

const evalHelper = function({ helper, opts }) {
  const { value, propPath, topName } = getHelperValue({ helper, opts })

  // Unkwnown helpers or helpers with `undefined` values return `undefined`,
  // instead of throwing an error. This allows users to use dynamic helpers, where
  // some properties might be defined or not.
  if (value === undefined) {
    return
  }

  // `$$name` can be a promise if it is an async `get` function, e.g. with `task.alias`
  return promiseThen(value, valueA =>
    getHelperProp({ value: valueA, helper, opts, propPath, topName }),
  )
}

// Retrieve helper's top-level value
const getHelperValue = function({ helper, helper: { name }, opts, opts: { data } }) {
  const { topName, propPath } = parseName({ name })

  const value = data[topName]

  const valueA = evalFunction({ value, helper, opts })

  return { value: valueA, propPath, topName }
}

// `$$name` and `{ $$name: arg }` can both use dot notations
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
// away with `context` as sole argument.
// It can be an async function.
// Used by `task.alias`.
const evalFunction = function({ value, helper: { type }, opts: { context } }) {
  // Only if `function.context: true` to avoid firing library functions that are
  // also used as objects, e.g. Lodash
  if (type === 'function' || typeof value !== 'function' || !value.context) {
    return value
  }

  return value(context)
}

// Retrive helper's non-top-level value (i.e. property path)
const getHelperProp = function({ value, helper, opts, propPath, topName }) {
  // We pass `topName` to ensure `error.property` uses only top-level property
  // if an error is thrown
  const valueA = eSubstituteValue({ value, opts, helper, name: topName })

  return promiseThen(valueA, valueB => evalHelperProp({ value: valueB, opts, helper, propPath }))
}

// An helper `$$name` can contain other helpers, which are then processed
// recursively.
// This can be used e.g. to create aliases.
// This is done only on `$$name` but not `{ $$name: arg }` return value because:
//  - in functions, it is most likely not the desired intention of the user
//  - it would require complex escaping (if user does not desire recursion)
//  - recursion can be achieved by using `context.helpers()`
const substituteValue = function({ value, opts: { recursive } }) {
  return recursive(value)
}

const eSubstituteValue = addErrorHandler(substituteValue, helperHandler)

const evalHelperProp = function({ value, opts, helper, helper: { name }, propPath }) {
  const valueA = getProp({ value, propPath })

  if (valueA === undefined) {
    return
  }

  return eEvalHelperFunction({ value: valueA, helper, opts, name })
}

const getProp = function({ value, propPath }) {
  if (propPath === undefined) {
    return value
  }

  return get(value, propPath)
}

// Fire helper when it's a function `{ $$name: arg }`
const evalHelperFunction = function({ value, helper: { type, arg }, opts }) {
  if (type !== 'function') {
    return value
  }

  const args = getHelperArgs({ value, arg, opts })

  return value(...args)
}

// Helper function arguments
const getHelperArgs = function({ value, arg, opts: { context } }) {
  // Can use `{ $$helper: [...] }` to pass several arguments to the helper
  // E.g. `{ $$myFunc: [1, 2] }` will fire `$$myFunc(1, 2, context)`
  const args = Array.isArray(arg) ? arg : [arg]

  // Pass same `context` as `run` handlers
  // Only pass it when `helperFunction.context` is `true`
  // Reason: allowing re-using external/library functions without modifying their
  // signature or wrapping them
  if (!value.context) {
    return args
  }

  // Pass as first argument. Reason: easier to parse arguments when arguments are
  // variadic or when there are optional arguments
  return [context, ...args]
}

const eEvalHelperFunction = addErrorHandler(evalHelperFunction, helperHandler)

module.exports = {
  substituteHelpers,
}
