'use strict'

const { throwError } = require('../errors')
const { validateFromSchema } = require('../utils')

const CONFIG_SCHEMA = require('./schema')

// Validate configuration
const validateConfig = function({ config }) {
  const { error, path } = validateFromSchema({
    schema: CONFIG_SCHEMA,
    value: config,
    name: 'config',
  })
  if (error === undefined) {
    return
  }

  throwError(`Configuration is invalid: ${error}`, { property: path })
}

module.exports = {
  validateConfig,
}
