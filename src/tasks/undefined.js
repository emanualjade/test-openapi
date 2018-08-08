'use strict'

const { crawl } = require('../utils')

// We allow `undefined` in tasks as it is useful to override values.
// E.g. a task might want to unset a value set by `glob` or `spec` plugin.
// However since we only allow JSON in input, we allow `undefined` as a string.
// It is converted here to an actual `undefined` value.
// It can also be escaped with backslash if we actually meant the `undefined` string.
const handleUndefined = function({ tasks }) {
  return crawl(tasks, handleUndefinedValue)
}

const handleUndefinedValue = function(value) {
  if (value === ESCAPED_UNDEFINED) {
    return UNDEFINED
  }

  if (value === UNDEFINED) {
    return undefined
  }

  return value
}

const UNDEFINED = 'undefined'
const ESCAPED_UNDEFINED = '\\undefined'

module.exports = {
  handleUndefined,
}
