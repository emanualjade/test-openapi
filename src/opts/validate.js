'use strict'

const { validateFromSchema } = require('../utils')
const { throwConfigError } = require('../errors')

const OPTS_SCHEMA = require('./schema')

// Validate configuration options
const validateOpts = function({ opts }) {
  const { error, path } = validateFromSchema({ schema: OPTS_SCHEMA, value: opts, name: 'options' })
  if (error === undefined) {
    return
  }

  throwConfigError(`Configuration options are invalid: ${error}`, { property: path })
}

module.exports = {
  validateOpts,
}
