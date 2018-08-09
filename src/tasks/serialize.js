'use strict'

const { crawl, isObject, getPath } = require('../utils')

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
const parseInput = function(obj, throwError) {
  crawl(obj, (value, path) => parseInputValue({ value, path, throwError }), {
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
const serializeOutput = function(obj, throwError) {
  return crawl(obj, (value, path) => serializeOutputValue({ value, path, throwError }), {
    skipUndefined: true,
    topDown: true,
  })
}

const serializeOutputValue = function({ value, path, throwError }) {
  // `undefined` values are removed by `crawl()`
  if (isJsonType(value) || value === undefined) {
    return value
  }

  if (typeof value === 'function') {
    return serializeFunction(value)
  }

  const message = getMessage({ value, path })
  throwError({ message, value, path })
}

const serializeFunction = function({ name }) {
  const nameA = name || DEFAULT_FUNC_NAME
  return `function ${nameA}()`
}

const DEFAULT_FUNC_NAME = 'anonymous'

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
