import { getPath } from '../utils/path.js'
import { isObject } from '../utils/types.js'

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
//       `undefined` allow to remove a value that was set by a `merge` task
//       or by `spec` plugin.
//  - but serialized to JSON in output for the reasons above

// Check if valid JSON type
export const isJsonType = function(value) {
  return (
    ['string', 'number', 'boolean'].includes(typeof value) ||
    value === null ||
    Array.isArray(value) ||
    isObject(value)
  )
}

// Error message
export const getMessage = function({ value, path }) {
  const property = getPath(path)
  return `property '${property}' with value '${value}' is invalid: it can only be a JSON type, undefined or a function`
}

// We allow `undefined` in input as it is useful to override values.
// E.g. a task might want to unset a value set by `merge` or `spec` plugin.
// However since we only allow JSON in input, we allow `undefined` as a string.
// It is converted here to an actual `undefined` value.
// It can also be escaped with backslash if we actually meant the
// `undefined` string.
export const UNDEFINED = 'undefined'
export const ESCAPED_UNDEFINED = '\\undefined'
