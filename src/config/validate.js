'use strict'

const { TestOpenApiError } = require('../errors')
const { checkSchema, checkJson } = require('../validation')

const CONFIG_SCHEMA = require('./schema')

// Validate configuration
const validateConfig = function({ config }) {
  checkSchema({
    schema: CONFIG_SCHEMA,
    value: config,
    name: 'config',
    message: 'Configuration',
  })

  // Make sure input configuration is valid JSON
  checkJson({ value: config, getError })
}

const getError = function(message) {
  return new TestOpenApiError(`Configuration is not valid JSON${message}`)
}

module.exports = {
  validateConfig,
}
