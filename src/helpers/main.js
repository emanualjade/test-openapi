'use strict'

const { get } = require('lodash')

const { addErrorHandler } = require('../errors')
const { crawl } = require('../utils')

const { parseHelper, parseEscape } = require('./parse')
const { checkRecursion } = require('./recursion')
const { helperHandler } = require('./error')
const coreHelpers = require('./core')

// Crawl a value recursively to find helpers.
// When an helper is found, it is replaced by its evaluated value.
const substituteHelpers = function(info, value) {
  return crawl(value, evalNode, info)
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
  const value = getHelperValue({ helper, info })

  // Unkwnown helpers or helpers with `undefined` values return `undefined`,
  // instead of throwing an error. This allows users to use dynamic helpers, where
  // some properties might be defined or not.
  if (value === undefined) {
    return
  }

  return eEvalHelperValue({ value, helper, info })
}

const getHelperValue = function({
  helper: { name },
  info: {
    context: {
      config: { helpers },
    },
  },
}) {
  // User-defined helpers have loading priority over core helpers.
  // Like this, adding core helpers is non-breaking.
  // Also this allows overriding / monkey-patching core helpers (which can be
  // either good or bad).
  const helpersA = { ...coreHelpers, ...helpers }

  // `$$name` and `{ $$name: arg }` can both use dot notations
  const value = get(helpersA, name)
  return value
}

const evalHelperValue = function({ value, helper: { type, arg }, info, info: { context } }) {
  // Update `info.stack` for recursive helper
  const recursiveSubstitute = substituteHelpers.bind(null, info)

  if (type === 'value') {
    // An helper `$$name` can contain other helpers, which are then processed
    // recursively.
    // This can be used e.g. to create aliases.
    // This is done only on `$$name` not `{ $$name: arg }` because:
    //  - in functions, it is most likely not the desired intention of the user
    //  - it would require complex escaping (if user does not desire recursion)
    //  - recursion can be achieved by using `context.helpers()`
    return recursiveSubstitute(value)
  }

  const contextA = { ...context, helpers: recursiveSubstitute }
  const args = getHelperArgs({ value, arg, context: contextA })

  return value(...args)
}

// Helper function arguments
const getHelperArgs = function({ value, arg, context }) {
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

const eEvalHelperValue = addErrorHandler(evalHelperValue, helperHandler)

module.exports = {
  substituteHelpers,
}
