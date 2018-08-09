'use strict'

const { checkSchema } = require('../validation')

const CONFIG_SCHEMA = require('./schema')

// Validate configuration
const validateConfig = function({ config }) {
  checkSchema({
    schema: CONFIG_SCHEMA,
    value: config,
    name: 'config',
    message: 'Configuration',
  })
}

module.exports = {
  validateConfig,
}
