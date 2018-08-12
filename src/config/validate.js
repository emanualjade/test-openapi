'use strict'

const { checkSchema } = require('../validation')

const CONFIG_SCHEMA = require('./schema')

// Validate configuration
const validateConfig = function({ config }) {
  checkSchema({
    schema: CONFIG_SCHEMA,
    value: config,
    valueProp: 'config',
    message: 'configuration is invalid',
  })
}

module.exports = {
  validateConfig,
}
