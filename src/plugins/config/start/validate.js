'use strict'

const { throwConfigError } = require('../../../errors')
const { validateFromSchema } = require('../../../utils')

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

  throwConfigError(`Configuration is invalid: ${error}`, { property: path })
}

module.exports = {
  validateConfig,
}
