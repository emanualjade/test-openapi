'use strict'

const { isObject, promiseThen, promiseAll, promiseAllThen } = require('../../utils')
const { TestOpenApiError, addErrorHandler } = require('../../errors')

// Helpers use a special notation `{ $name: arg }` inside any task, including
// in deep properties, for dynamic values. Helpers functions are evaluated
// before the task run, e.g. plugins do not need to be helpers-aware.
// Helpers still happen after:
//  - `task|only` plugin: to avoid unnecessary long helpers evaluation on skipped task
//  - `repeat` plugin: to repeat helpers that rely on global state, e.g. `$random`
//    or `$task` helper s
const run = function(task, context, advancedContext) {
  // Might be a promise or not
  const taskA = crawlNode(task, [], { task, context, advancedContext })
  return taskA
}

// Crawl a task recursively to find helpers.
// When an helper is found, it is replaced by its evaluated value.
// We use `promise[All][Then]()` utilities to avoid creating microtasks when
// no helpers is found or when helpers are synchronous.
const crawlNode = function(value, path, info) {
  // Children must be evaluated before parents
  const valueA = crawlChildren(value, path, info)
  return promiseThen(valueA, valueB => eEvaluateNode(valueB, path, info))
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
  // Helpers that return `undefined` are omitted (as opposed to being set to
  // `undefined`) to keep task JSON-serializable and avoid properties that
  // are defined but set to `undefined`
  if (child === undefined) {
    return
  }

  return { [key]: child }
}

const mergeProperties = function(children) {
  return Object.assign({}, ...children)
}

const evaluateNode = function(value, path, info) {
  const helper = parseHelper(value)
  if (helper === undefined) {
    return value
  }

  const { name, arg } = helper

  const unescapedValue = parseEscape({ name, arg })
  if (unescapedValue !== undefined) {
    return unescapedValue
  }

  const infoA = checkRecursion({ name, arg, path }, info)

  const valueA = evaluateHelper({ name, arg, info: infoA })

  // An helper evaluation can contain other helpers, which are then processed
  // recursively.
  // This can be used e.g. to create aliases with the `$var` helper:
  //   `{ $var: alias }` with `config.helpers.$var: { alias: { $otherHelper: arg } }`
  return crawlNode(valueA, path, infoA)
}

// Attach `error.property`. In case of recursion, the top-level node should prevail.
const evaluateNodeHandler = function(error, value, path) {
  error.property = path.join('.')
  throw error
}

const eEvaluateNode = addErrorHandler(evaluateNode, evaluateNodeHandler)

// Parse `{ $name: arg }` into `{ name, arg }`
const parseHelper = function(object) {
  if (!isObject(object)) {
    return
  }

  const keys = Object.keys(object)
  // Helpers are objects with a single property starting with `$`
  // This allows objects with several properties not to need escaping
  if (keys.length !== 1) {
    return
  }

  const [name] = keys
  if (!name.startsWith('$')) {
    return
  }

  const arg = object[name]
  return { name, arg }
}

// To escape an object that could be taken for an helper (but is not), one can
// add an extra `$`, i.e. `{ $$name: arg }` becomes `{ $name: arg }`
// This works with multiple `$` as well
const parseEscape = function({ name, arg }) {
  if (!name.startsWith('$$')) {
    return
  }

  const nameA = name.replace('$', '')
  return { [nameA]: arg }
}

// Since helpers can return other helpers which then get evaluated, we need
// to check for infinite recursions.
const checkRecursion = function({ name, arg, path }, { stack = [], ...info }) {
  const stackElem = { name, arg: JSON.stringify(arg), path: path.join('.') }

  const alreadyPresent = stack.some(stackElemA => isSameStackElem(stackElem, stackElemA))
  if (!alreadyPresent) {
    return { ...info, stack: [...stack, stackElem] }
  }

  const [{ name: firstHelper }] = stack
  throw new TestOpenApiError(`Infinite recursion when evaluating the helper '${firstHelper}'`)
}

const isSameStackElem = function(stackElemA, stackElemB) {
  return stackElemA.name === stackElemB.name && stackElemA.arg === stackElemB.arg
}

const evaluateHelper = function({ name, arg, info }) {
  const helperFunc = getHelperFunc({ name, info })

  const options = getHelperOptions({ name, info })

  return eFireHelper({ helperFunc, arg, name, options, info })
}

const getHelperFunc = function({
  name,
  info: {
    context: {
      config: { helpers: { custom: helpersFuncs = {} } = {} },
    },
  },
}) {
  // User-defined helpers have loading priority over core helpers.
  // Like this, adding core helpers is non-breaking.
  // Also this allows overriding / monkey-patching core helpers (which can be
  // either good or bad).
  const userFunc = helpersFuncs[name]
  if (userFunc !== undefined) {
    return userFunc
  }

  return eRequireHelper(name)
}

// We do not allow unknown helpers, so that adding new helpers (user-defined
// or core-defined) is predictable and non-breaking
// TODO: separate helpers in their own node modules instead
const requireHelper = function(name) {
  // eslint-disable-next-line import/no-dynamic-require
  return require(`../../helpers/${removePrefix(name)}`)
}

const requireHelperHandler = function({ code, message }, name) {
  const nameA = `'test-openapi-helper-${removePrefix(name)}'`

  if (code === 'MODULE_NOT_FOUND') {
    throw new TestOpenApiError(`The helper ${nameA} is used but is not installed`)
  }

  // Throw a `bug` error
  throw new Error(`The helper ${nameA} could not be loaded: ${message}`)
}

const eRequireHelper = addErrorHandler(requireHelper, requireHelperHandler)

const removePrefix = function(name) {
  return name.replace('$', '')
}

const getHelperOptions = function({
  name,
  info: {
    context: {
      config: { helpers: helpersOptions = {} },
    },
  },
}) {
  return helpersOptions[name]
}

const fireHelper = function({
  helperFunc,
  arg,
  options,
  info: { task, context, advancedContext },
}) {
  return helperFunc(arg, { options, task, ...context }, advancedContext)
}

const fireHelperHandler = function({ message }, { name }) {
  throw new TestOpenApiError(`Error when evaluating the helper '${name}': ${message}`)
}

const eFireHelper = addErrorHandler(fireHelper, fireHelperHandler)

module.exports = {
  run,
}
