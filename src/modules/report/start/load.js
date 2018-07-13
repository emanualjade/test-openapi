'use strict'

const { addErrorHandler, TestOpenApiError } = require('../../../errors')

// Load reporter's module
// TODO: use separate Node modules instead
const loadReporter = function({ name }) {
  // eslint-disable-next-line import/no-dynamic-require
  const reporter = require(`../reporters/${name}`)
  return { ...reporter, name }
}

const loadReporterHandler = function(_, { name }) {
  throw new TestOpenApiError(
    `The reporter '${name}' is used in the configuration but is not installed. Please run 'npm install test-openapi-reporter-${name}'.`,
    { property: `report.${name}` },
  )
}

const eLoadReporter = addErrorHandler(loadReporter, loadReporterHandler)

module.exports = {
  loadReporter: eLoadReporter,
}
