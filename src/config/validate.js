'use strict'

const { checkSchema } = require('../validation')

const CONFIG_SCHEMA = require('./schema')

// Validate configuration
const validateConfig = function({ config }) {
  checkSchema({
    schema: CONFIG_SCHEMA,
    value: config,
    name: 'config',
    propName: 'config',
    message: 'Configuration is invalid:',
  })
}

module.exports = {
  validateConfig,
}
