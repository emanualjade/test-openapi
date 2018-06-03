'use strict'

const { addErrorHandler, TestOpenApiError } = require('../../../errors')

// Load reporter's module
// TODO: use separate Node modules instead
const loadReporter = function({ style }) {
  // eslint-disable-next-line import/no-dynamic-require
  return require(`../reporters/${style}`)
}

const loadReporterHandler = function(_, { style }) {
  throw new TestOpenApiError(
    `The reporter '${style}' is used in the configuration but is not installed. Please run 'npm install test-openapi-reporter-${style}'.`,
    { property: 'report.style' },
  )
}

const eLoadReporter = addErrorHandler(loadReporter, loadReporterHandler)

module.exports = {
  loadReporter: eLoadReporter,
}
