'use strict'

const { isObject } = require('../utils')

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

// Check whether value is an helper
const isHelper = function(value) {
  const helper = parseHelper(value)
  return helper !== undefined && !isEscape({ helper })
}

// To escape an object that could be taken for an helper (but is not), one can
// add an extra `$`, i.e. `{ $$$name: arg }` becomes `{ $$name: arg }`
// and `$$$name` becomes `$$name`
// This works with multiple `$` as well
const parseEscape = function({ helper, helper: { type, name, arg } }) {
  if (!isEscape({ helper })) {
    return
  }

  const nameA = name.replace(HELPERS_ESCAPE, '')

  if (type === 'function') {
    return { [nameA]: arg }
  }

  return nameA
}

const isEscape = function({ helper: { name } }) {
  return name.startsWith(`${HELPERS_ESCAPE}${HELPERS_PREFIX}`)
}

const HELPERS_PREFIX = '$$'
// Escape `$$name` with an extra dollar sign, i.e. `$$$name`
const HELPERS_ESCAPE = '$'

module.exports = {
  parseHelper,
  isHelper,
  parseEscape,
}
