'use strict'

const { TestOpenApiError } = require('../../../errors')
const { validateFromSchema } = require('../../../utils')

const REPORTER_SCHEMA = require('./reporter_schema')

const validateReporter = function({ options, reporter, style }) {
  validateModule({ reporter, style })
  validateOptions({ options, reporter, style })
}

// Validate reporter is valid module
const validateModule = function({ reporter, style }) {
  const { error } = validateFromSchema({ schema: REPORTER_SCHEMA, value: reporter })
  if (error === undefined) {
    return
  }

  // Throw a `bug` error
  throw new Error(`Reporter '${style}' is invalid: ${error}`)
}

// Validate `config.report.options`
const validateOptions = function({
  reporter: { config = {}, name },
  options: { [name]: options },
  style,
}) {
  if (options === undefined) {
    return
  }

  const { error } = validateFromSchema({ schema: config, value: options })
  if (error === undefined) {
    return
  }

  throw new TestOpenApiError(`'report.options.${name}' is invalid: ${error}`, {
    property: `report.options.${name}`,
    plugin: `reporter-${style}`,
  })
}

module.exports = {
  validateReporter,
}
