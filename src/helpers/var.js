'use strict'

const { get } = require('lodash')

// `{ $var: 'varName' }` helper
// Replaced by `config.helpers.$var.varName: value`
const varHelper = function(path, { options }) {
  // If either `path` is not present in `options` or if the value is `undefined`,
  // the returned value will be `undefined`
  const value = get(options, path)
  return value
}

module.exports = varHelper
