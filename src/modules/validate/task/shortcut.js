'use strict'

const { mapValues } = require('lodash')

const { isObject } = require('../../../utils')

// `task.validate.*: non-object` is shortcut for `{ enum: [value] }`
const applyShortcuts = function({ validate }) {
  return mapValues(validate, applyShortcut)
}

// Normalize non-JSON schemas to a `const` JSON schema
const applyShortcut = function(value) {
  if (isObject(value)) {
    return value
  }

  const type = guessType(value)
  return { type, enum: [value] }
}

// When using the shortcut notation, we need to set the `type` to make sure it
// matches the value (in case it is not set, or set to several types, or set to
// a different type)
const guessType = function(value) {
  const [type] = TYPES.find(([, condition]) => condition(value))
  return type
}

const TYPES = Object.entries({
  null: value => value === null,
  integer: Number.isInteger,
  number: value => typeof value === 'number' && !Number.isInteger(value),
  string: value => typeof value === 'string',
  boolean: value => typeof value === 'boolean',
  array: Array.isArray,
  // Default
  object: () => true,
})

module.exports = {
  applyShortcuts,
}
