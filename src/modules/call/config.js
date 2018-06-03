'use strict'

const METHODS = require('methods')

const config = require('./config.json')

const UPPERCASE_METHODS = METHODS.map(method => method.toUpperCase())

// Add all allowed HTTP methods to config validation
const validateHttpMethods = function({ config }) {
  config.task.schema.patternProperties['^method'].enum = [...METHODS, ...UPPERCASE_METHODS]

  return config
}

const configA = validateHttpMethods({ config })

module.exports = {
  config: configA,
}
