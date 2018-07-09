'use strict'

const { omit, get } = require('lodash')

const coreHelpers = require('../../helpers')
const { isObject, promiseThen, promiseAll, promiseAllThen } = require('../../utils')
const { TestOpenApiError, addErrorHandler } = require('../../errors')

// Helpers use a special notation `{ $$name: arg }` inside any task, including
// in deep properties, for dynamic values. Helpers functions are evaluated
// before the task run, e.g. plugins do not need to be helpers-aware.
// Helpers still happen after:
//  - `task|only` plugin: to avoid unnecessary long helpers evaluation on skipped task
//  - `repeat` plugin: to repeat helpers that rely on global state, e.g. `$$random`
//    or `$$task` helpers
const run = function(task, context, advancedContext) {
  const taskA = crawlNode(task, [], { task, context, advancedContext })
  return promiseThen(taskA, updateOriginalTask)
}

// Crawl a task recursively to find helpers.
// When an helper is found, it is replaced by its evaluated value.
// We use `promise[All][Then]()` utilities to avoid creating microtasks when
// no helpers is found or when helpers are synchronous.
const crawlNode = function(value, path, info) {
  // Children must be evaluated before parents
  const valueA = crawlChildren(value, path, info)
  return promiseThen(valueA, valueB => eEvalNode(valueB, path, info))
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

  const { name, arg } = helper

  const unescapedValue = parseEscape({ name, arg })
  if (unescapedValue !== undefined) {
    return unescapedValue
  }

  const infoA = checkRecursion({ name, arg }, info)

  const valueA = evalHelper({ name, arg, info: infoA })

  // An helper evaluation can contain other helpers, which are then processed
  // recursively.
  // This can be used e.g. to create aliases with the `$$var` helper:
  //   `{ $$var: alias }` with `config.helpers.$$var: { alias: { $$otherHelper: arg } }`
  return crawlNode(valueA, path, infoA)
}

// Attach `error.property: path.to.$$FUNC` and `error.value: helperArg` to every
// error thrown during helpers substitution: helper-thrown error, helper loading
// problem, recursion error, etc.
// In case of recursive helper, the top-level node should prevail.
const evalNodeHandler = function(error, value, path) {
  const { name, arg } = parseHelper(value)
  const property = [...path, name].join('.')
  Object.assign(error, { property, value: arg })
  throw error
}

const eEvalNode = addErrorHandler(evalNode, evalNodeHandler)

// Parse `{ $$name: arg }` into `{ name, arg }`
const parseHelper = function(object) {
  if (!isObject(object)) {
    return
  }

  const keys = Object.keys(object)
  // Helpers are objects with a single property starting with `$$`
  // This allows objects with several properties not to need escaping
  if (keys.length !== 1) {
    return
  }

  const [name] = keys
  if (!name.startsWith('$$')) {
    return
  }

  const arg = object[name]
  return { name, arg }
}

// To escape an object that could be taken for an helper (but is not), one can
// add an extra `$`, i.e. `{ $$$name: arg }` becomes `{ $$name: arg }`
// This works with multiple `$` as well
const parseEscape = function({ name, arg }) {
  if (!name.startsWith('$$$')) {
    return
  }

  const nameA = name.replace('$', '')
  return { [nameA]: arg }
}

// Since helpers can return other helpers which then get evaluated, we need
// to check for infinite recursions.
const checkRecursion = function({ name, arg }, { stack = [], ...info }) {
  const stackElem = { name, arg: JSON.stringify(arg) }

  const alreadyPresent = stack.some(stackElemA => isSameStackElem(stackElem, stackElemA))

  const stackA = [...stack, stackElem]

  if (!alreadyPresent) {
    return { ...info, stack: stackA }
  }

  const cycle = getCycle({ stack: stackA })
  throw new TestOpenApiError(`Infinite recursion when evaluating the helper:\n   ${cycle}`)
}

const isSameStackElem = function(stackElemA, stackElemB) {
  return stackElemA.name === stackElemB.name && stackElemA.arg === stackElemB.arg
}

// Pretty printing of the recursion stack
const getCycle = function({ stack }) {
  return stack.map(printStackElem).join(`\n ${RIGHT_ARROW} `)
}

const printStackElem = function({ name, arg }) {
  return `${name}: ${arg}`
}

const RIGHT_ARROW = '\u21aa'

const evalHelper = function({ name, arg, info }) {
  const helper = getHelper({ name, info })

  return eEvalHelperFunc({ helper, arg, info })
}

const getHelper = function({
  name,
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

  const helper = get(helpersA, name)
  return helper
}

const evalHelperFunc = function({ helper, arg, info: { task, context, advancedContext } }) {
  // Unkwnown helpers or helpers with `undefined` values return `undefined`,
  // instead of throwing an error. This allows users to use dynamic helpers, where
  // some properties might be defined or not.
  if (helper === undefined) {
    return
  }

  // Can use `{ $$helper: [...] }` to pass several arguments to the helper
  // E.g. `{ $$myFunc: [1, 2] }` will fire `$$myFunc(1, 2, context, advancedContext)`
  const args = Array.isArray(arg) ? arg : [arg]

  return helper(...args, { task, ...context }, advancedContext)
}

const evalHelperFuncHelper = function(error) {
  const { message } = error

  if (!message.includes(HELPER_ERROR_MESSAGE)) {
    error.message = `${HELPER_ERROR_MESSAGE}${message}`
  }

  throw error
}

const HELPER_ERROR_MESSAGE = 'Error when evaluating helper: '

const eEvalHelperFunc = addErrorHandler(evalHelperFunc, evalHelperFuncHelper)

// Update `originalTask` so that helpers are shown evaluated in both return value
// and reporting
const updateOriginalTask = function(task) {
  // No nested `originalTask`
  const originalTask = omit(task, 'originalTask')
  return { ...task, originalTask }
}

module.exports = {
  run,
}
