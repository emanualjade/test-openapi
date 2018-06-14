'use strict'

const { dump: yamlDump } = require('js-yaml')

const { fullIndent } = require('./indent')

// Stringify value, prettifying it to YAML if it's an object or an array
const stringifyValue = function(value) {
  if (typeof value !== 'object' || value === null) {
    return String(value)
  }

  const string = yamlDump(value, YAML_OPTS)
  const stringA = string.replace(/\n$/, '')
  const stringB = `\n${fullIndent(stringA)}`
  return stringB
}

const YAML_OPTS = { noRefs: true }

module.exports = {
  stringifyValue,
}
