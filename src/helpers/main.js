'use strict'

const { get, isEqual } = require('lodash')

const { isObject, promiseThen, promiseAll, promiseAllThen } = require('../utils')
const { TestOpenApiError, addErrorHandler } = require('../errors')

const coreHelpers = require('./core')

// Crawl a task recursively to find helpers.
// When an helper is found, it is replaced by its evaluated value.
// We use `promise[All][Then]()` utilities to avoid creating microtasks when
// no helpers is found or when helpers are synchronous.
const substituteHelpers = function({ task, context, advancedContext }, value) {
  return crawlNode(value, [], { task, context, advancedContext })
}

const crawlNode = function(value, path, info) {
  // Children must be evaluated before parents
  const valueA = crawlChildren(value, path, info)
  return promiseThen(valueA, valueB => evalNode(valueB, path, info))
}

// Siblings evaluation is done in parallel for best performance.
const crawlChildren = function(value, path, info) {
  if (Array.isArray(value)) {
    const children = value.map((child, index) => crawlNode(child, [...path, index], info))
    return promiseAll(children)
  }

  if (isObject(value)) {
    const children = Object.entries(value).map(([key, child]) =>
      crawlProperty({ key, child, path, info }),
    )
    return promiseAllThen(children, mergeProperties)
  }

  return value
}

const crawlProperty = function({ key, child, path, info }) {
  const maybePromise = crawlNode(child, [...path, key], info)
  return promiseThen(maybePromise, childA => getProperty({ key, child: childA }))
}

const getProperty = function({ key, child }) {
  // Helpers that do not exist or that return `undefined` are omitted
  // (as opposed to being set to `undefined`) to keep task JSON-serializable
  // and avoid properties that are defined but set to `undefined`
  if (child === undefined) {
    return
  }

  return { [key]: child }
}

const mergeProperties = function(children) {
  return Object.assign({}, ...children)
}

const evalNode = function(value, path, info) {
  const helper = parseHelper(value)
  if (helper === undefined) {
    return value
  }

  const unescapedValue = parseEscape({ helper })
  if (unescapedValue !== undefined) {
    return unescapedValue
  }

  const infoA = checkRecursion({ helper, info })

  const valueA = evalHelper({ helper, path, info: infoA })
  return valueA
}

// Parse `{ $$name: arg }` into `{ name: '$$name', arg }`
// and `$$name` into `{ name: '$$name' }`
const parseHelper = function(value) {
  // `$$name`
  if (typeof value === 'string' && value.startsWith(HELPERS_PREFIX)) {
    return { type: 'value', name: value }
  }

  if (!isObject(value)) {
    return
  }

  const keys = Object.keys(value)
  // Helpers are objects with a single property starting with `$$`
  // This allows objects with several properties not to need escaping
  if (keys.length !== 1) {
    return
  }

  const [name] = keys
  if (!name.startsWith(HELPERS_PREFIX)) {
    return
  }

  // `{ $$name: arg }`
  const arg = value[name]
  return { type: 'function', name, arg }
}

// To escape an object that could be taken for an helper (but is not), one can
// add an extra `$`, i.e. `{ $$$name: arg }` becomes `{ $$name: arg }`
// and `$$$name` becomes `$$name`
// This works with multiple `$` as well
const parseEscape = function({ helper: { type, name, arg } }) {
  if (!name.startsWith(`${HELPERS_ESCAPE}${HELPERS_PREFIX}`)) {
    return
  }

  const nameA = name.replace(HELPERS_ESCAPE, '')

  if (type === 'function') {
    return { [nameA]: arg }
  }

  return nameA
}

const HELPERS_PREFIX = '$$'
// Escape `$$name` with an extra dollar sign, i.e. `$$$name`
const HELPERS_ESCAPE = '$'

// Since helpers can return other helpers which then get evaluated, we need
// to check for infinite recursions.
const checkRecursion = function({ helper, info: { stack = [], ...info } }) {
  const alreadyPresent = stack.some(helperA => isEqual(helper, helperA))

  const stackA = [...stack, helper]

  if (!alreadyPresent) {
    return { ...info, stack: stackA }
  }

  const cycle = getCycle({ stack: stackA })
  throw new TestOpenApiError(`Infinite recursion:\n   ${cycle}`)
}

// Pretty printing of the recursion stack
const getCycle = function({ stack }) {
  return stack.map(printHelper).join(`\n ${RIGHT_ARROW} `)
}

const printHelper = function({ type, name, arg }) {
  if (type === 'function') {
    return `${name}: ${arg}`
  }

  return name
}

const RIGHT_ARROW = '\u21aa'

const evalHelper = function({ helper, path, info }) {
  const value = getHelperValue({ helper, info })

  // Unkwnown helpers or helpers with `undefined` values return `undefined`,
  // instead of throwing an error. This allows users to use dynamic helpers, where
  // some properties might be defined or not.
  if (value === undefined) {
    return
  }

  return eEvalHelperValue({ value, helper, path, info })
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
  const helpersA = { ...coreHelpers, ...helpers, $$status: 401 }

  const value = get(helpersA, name)
  return value
}

const evalHelperValue = function({
  value,
  helper: { type, arg },
  path,
  info,
  info: { task, context, advancedContext },
}) {
  if (type === 'value') {
    // An helper `$$name` can contain other helpers, which are then processed
    // recursively.
    // This can be used e.g. to create aliases.
    // This is done only on `$$name` not `{ $$name: arg }` because:
    //  - in functions, it is most likely not the desired intention of the user
    //  - it would require complex escaping (if user does not desire recursion)
    //  - recursion can be achieved by using `context.variable()`
    return crawlNode(value, path, info)
  }

  // Can use `{ $$helper: [...] }` to pass several arguments to the helper
  // E.g. `{ $$myFunc: [1, 2] }` will fire `$$myFunc(1, 2, context, advancedContext)`
  const args = Array.isArray(arg) ? arg : [arg]

  // Helper functions get `context.task` with the original task (before helpers evaluation)
  return value(...args, { task, ...context }, advancedContext)
}

const evalHelperValueHelper = function(error, { value, helper, path }) {
  const { message } = error

  if (!message.includes(HELPER_ERROR_MESSAGE)) {
    error.message = `${HELPER_ERROR_MESSAGE}${message}`
  }

  setHelperErrorProps({ error, value, helper, path })

  throw error
}

const eEvalHelperValue = addErrorHandler(evalHelperValue, evalHelperValueHelper)

const HELPER_ERROR_MESSAGE = 'Error when evaluating helper: '

// Attach error properties to every error thrown during helpers substitution:
// helper-thrown error, recursion error:
//  - `property`: `path.to.$$FUNC`
//  - `value`: `helperArg` (if function) or `value`: `helperValue` (if `value`)
// In case of recursive helper, the top-level node should prevail.
const setHelperErrorProps = function({ error, value, helper, path }) {
  const errorProps = getHelperErrorProps({ value, helper, path })
  Object.assign(error, errorProps)

  // `error.expected` does not make any more sense since we remove `error.value`
  delete error.expected
}

const getHelperErrorProps = function({ value, helper: { type, name, arg }, path }) {
  const property = [...path, name].join('.')

  if (type === 'function') {
    return { property, value: arg }
  }

  return { property, value }
}

module.exports = {
  substituteHelpers,
}
