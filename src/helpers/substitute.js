'use strict'

const { get } = require('lodash')

const { addErrorHandler } = require('../errors')
const { crawl, promiseThen } = require('../utils')

const { parseHelper, parseEscape } = require('./parse')
const { checkRecursion } = require('./recursion')
const { helperHandler } = require('./error')
const coreHelpers = require('./core')

// Crawl a value recursively to find helpers.
// When an helper is found, it is replaced by its evaluated value.
const substituteHelpers = function(info, value, path) {
  return crawl(value, evalNode, { path, ...info })
}

// Evaluate an object or part of an object for helpers
const evalNode = function(value, path, info) {
  const infoA = { ...info, path }

  const helper = parseHelper(value)
  // There is no helper
  if (helper === undefined) {
    return value
  }

  const unescapedValue = parseEscape({ helper })
  // There was something that looked like a helper but was an escaped value
  if (unescapedValue !== undefined) {
    return unescapedValue
  }

  // Check for infinite recursions
  const infoB = checkRecursion({ helper, info: infoA })

  const valueA = evalHelper({ helper, info: infoB })
  return valueA
}

const evalHelper = function({ helper, info }) {
  const { value, propPath, topName } = getHelperValue({ helper, info })

  // Unkwnown helpers or helpers with `undefined` values return `undefined`,
  // instead of throwing an error. This allows users to use dynamic helpers, where
  // some properties might be defined or not.
  if (value === undefined) {
    return
  }

  // `$$name` can be a promise if it is an async `get` function, e.g. with `task.alias`
  return promiseThen(value, valueA =>
    getHelperProp({ value: valueA, helper, info, propPath, topName }),
  )
}

// Retrieve helper's top-level value
const getHelperValue = function({
  helper,
  helper: { name },
  info,
  info: {
    context: {
      config: { helpers: configHelpers },
      startData: { helpers: startDataHelpers },
      task: { helpers: taskHelpers },
    },
  },
}) {
  // User-defined helpers have loading priority over core helpers.
  // Like this, adding core helpers is non-breaking.
  // Also this allows overriding / monkey-patching core helpers (which can be
  // either good or bad).
  const helpersA = { ...coreHelpers, ...configHelpers, ...startDataHelpers, ...taskHelpers }

  // `$$name` and `{ $$name: arg }` can both use dot notations
  // The top-level value is first evaluated (including recursively parsing its
  // helpers) then the rest of the property path is applied.
  const [topName, ...propPath] = name.split('.')

  const value = helpersA[topName]

  const valueA = evalFunction({ value, helper, info })

  return { value: valueA, propPath, topName }
}

// If `$$name` (but not `{ $$name: arg }`) is a function, it is evaluated right
// away with `context` as sole argument.
// It can be an async function.
// Used by `task.alias`.
const evalFunction = function({ value, helper: { type }, info }) {
  // Only if `function.context: true` to avoid firing library functions that are
  // also used as objects, e.g. Lodash
  if (type === 'function' || typeof value !== 'function' || !value.context) {
    return value
  }

  const context = getHelperContext({ info })
  return value(context)
}

// Retrive helper's non-top-level value (i.e. property path)
const getHelperProp = function({ value, helper, info, propPath, topName }) {
  // We pass `topName` to ensure `error.property` uses only top-level property
  // if an error is thrown
  const valueA = eSubstituteValue({ value, info, helper, name: topName })

  return promiseThen(valueA, valueB => evalHelperProp({ value: valueB, info, helper, propPath }))
}

// An helper `$$name` can contain other helpers, which are then processed
// recursively.
// This can be used e.g. to create aliases.
// This is done only on `$$name` but not `{ $$name: arg }` return value because:
//  - in functions, it is most likely not the desired intention of the user
//  - it would require complex escaping (if user does not desire recursion)
//  - recursion can be achieved by using `context.helpers()`
const substituteValue = function({ value, info }) {
  return substituteHelpers(info, value)
}

const eSubstituteValue = addErrorHandler(substituteValue, helperHandler)

const evalHelperProp = function({ value, info, helper, helper: { name }, propPath }) {
  const valueA = getProp({ value, propPath })

  if (valueA === undefined) {
    return
  }

  return eEvalHelperFunction({ value: valueA, helper, info, name })
}

const getProp = function({ value, propPath }) {
  if (propPath.length === 0) {
    return value
  }

  return get(value, propPath)
}

// Fire helper when it's a function `{ $$name: arg }`
const evalHelperFunction = function({ value, helper: { type, arg }, info }) {
  if (type !== 'function') {
    return value
  }

  const args = getHelperArgs({ value, arg, info })

  return value(...args)
}

// Helper function arguments
const getHelperArgs = function({ value, arg, info }) {
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

  const context = getHelperContext({ info })
  // Pass as first argument. Reason: easier to parse arguments when arguments are
  // variadic or when there are optional arguments
  return [context, ...args]
}

// Context passed as argument to helper functions
const getHelperContext = function({ info, info: { context } }) {
  const recursiveSubstitute = substituteHelpers.bind(null, info)
  return { ...context, helpers: recursiveSubstitute }
}

const eEvalHelperFunction = addErrorHandler(evalHelperFunction, helperHandler)

module.exports = {
  substituteHelpers,
}
