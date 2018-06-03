'use strict'

const { TestOpenApiError } = require('../../../errors')
const { validateFromSchema } = require('../../../utils')

const REPORTER_SCHEMA = require('./reporter_schema')

// Validate reporter is valid module
const validateReporter = function({ reporterModule, style }) {
  const { error } = validateFromSchema({ schema: REPORTER_SCHEMA, value: reporterModule })
  if (error === undefined) {
    return
  }

  // Throw a `bug` error
  throw new Error(`Reporter '${style}' is invalid:${error}`)
}

// Validate `config.report.options`
const validateOptions = function({ options, config, style }) {
  const { error } = validateFromSchema({ schema: config, value: options })
  if (error === undefined) {
    return
  }

  throw new TestOpenApiError(`'report.options' for reporter '${style}' are invalid:${error}`, {
    property: 'report.options',
    plugin: `reporter-${style}`,
  })
}

module.exports = {
  validateReporter,
  validateOptions,
}
