'use strict'

const { capitalize } = require('underscore.string')

const { crawl, isObject, getPath } = require('../utils')
const { convertPlainObject, BugError } = require('../errors')

// Tasks and config are constrained to JSON.
// Reasons:
//  - more declarative:
//     - can be directly specified in JSON/YAML
//     - can be validated with JSON schema
//  - making sure return value is simple and serializable
//  - ensuring good reporting
//  - ensuring plugins can transfer it over network
//  - enforce that plugins are not returning functions.
//    Plugins should only return data/state.
//    If they want to return logic, they should export functions.
//    If they want to return bound functions, they should return the bound
//    argument and export the function separately.
//  - allow file format agnosticism for config and tasks
// `startData` is not constrained to JSON, e.g. it can use sockets.
// Output here means reporting not return value.
// Exception: functions and `undefined`:
//  - allowed in input for convenience:
//     - functions allow plugins to provide flexibility
//     - `undefined` is tedious to remove.
//       It also provide with the possibility to override values, e.g. using
//       `undefined` allow to remove a value that was set by a `glob` task
//       or by `spec` plugin.
//  - but serialized to JSON in output for the reasons above

// Applied on input config and tasks
const parseInput = function(taskOrConfig, throwError) {
  crawl(taskOrConfig, (value, path) => parseInputValue({ value, path, throwError }), {
    topDown: true,
  })
}

const parseInputValue = function({ value, path, throwError }) {
  if (isJsonType(value) || value === undefined || typeof value === 'function') {
    return value
  }

  const message = getMessage({ value, path })
  throwError({ message, value, path })
}

// Applied on tasks output, i.e. what is reported and returned
const serializeOutput = function({ task, plugins }) {
  const taskA = convertTaskError({ task })

  // We use a `state` object because `crawl` utility does not allow returning both
  // the crawled object and extra information
  const state = {}

  const taskB = crawl(taskA, (value, path) => serializeOutputValue({ value, path, state }), {
    skipUndefined: true,
    topDown: true,
  })

  const { error } = state
  const taskC = addSerializeError({ task: taskB, error, plugins })
  return taskC
}

// Convert errors to plain objects
const convertTaskError = function({ task, task: { error } }) {
  if (error === undefined) {
    return task
  }

  const errorA = convertError({ error })
  return { ...task, error: errorA }
}

const convertError = function({ error, error: { nested, nested: { error: nestedError } = {} } }) {
  const errorA = convertPlainObject(error)

  if (nestedError === undefined) {
    return errorA
  }

  const nestedErrorA = convertError({ error: nestedError })
  return { ...errorA, nested: { ...nested, error: nestedErrorA } }
}

const serializeOutputValue = function({ value, path, state }) {
  // `undefined` values are removed by `crawl()`
  if (isJsonType(value) || value === undefined) {
    return value
  }

  if (typeof value === 'function') {
    return serializeFunction(value)
  }

  // If the value cannot be serialized, returns the first one as `error`.
  // Serialize that value by removing it.
  const message = getMessage({ value, path })
  state.error = { message, value, path }
}

const serializeFunction = function({ name }) {
  const nameA = name || DEFAULT_FUNC_NAME
  return `function ${nameA}()`
}

const DEFAULT_FUNC_NAME = 'anonymous'

// If a value in `task.*` could not be serialized, we add it as `task.error`
// so it gets properly reported (as opposed to throwing an error)
const addSerializeError = function({ task, error, plugins }) {
  if (error === undefined) {
    return task
  }

  const errorA = getSerializeError({ error, plugins })
  const errorB = convertPlainObject(errorA)

  return { ...task, error: errorB }
}

const getSerializeError = function({ error: { message, value, path }, plugins }) {
  const messageA = capitalize(message)
  // Make sure `error.value` is JSON serializable
  const valueA = String(value)
  const property = getPath(['task', ...path])
  const module = guessModule({ path, plugins })

  const error = new BugError(messageA, { value: valueA, property, module })
  return error
}

// Try to guess `error.module` from where the value was in task.*
// This is not error-proof since plugins can modify input of other plugins.
const guessModule = function({ path: [name], plugins }) {
  const plugin = plugins.find(({ name: nameA }) => nameA === name)
  if (plugin === undefined) {
    return
  }

  return `plugin-${name}`
}

const isJsonType = function(value) {
  const type = typeof value
  return (
    type === 'string' ||
    type === 'number' ||
    type === 'boolean' ||
    value === null ||
    Array.isArray(value) ||
    isObject(value)
  )
}

const getMessage = function({ value, path }) {
  const property = getPath(path)
  return `property '${property}' with value '${value}' is invalid: it can only be a JSON type, undefined or a function`
}

module.exports = {
  parseInput,
  serializeOutput,
}
