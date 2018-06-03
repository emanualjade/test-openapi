'use strict'

const { dump: yamlDump } = require('js-yaml')

const { indent } = require('./indent')

// Stringify value, prettifying it to YAML if it's an object or an array
const stringifyValue = function(value) {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value !== 'object' || value === null) {
    return JSON.stringify(value)
  }

  const string = yamlDump(value, YAML_OPTS)
  const stringA = indent(`\n${string}`)
  return stringA
}

const YAML_OPTS = { noRefs: true }

module.exports = {
  stringifyValue,
}
