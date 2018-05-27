'use strict'

const { version: nodeVersion } = require('process')
const { platform } = require('os')

const { version: libraryVersion } = require('../../package')

const { TestOpenApiError } = require('./error')

// Normalize any error to our specific format
const normalizeError = function(error, properties) {
  if (!(error instanceof Error)) {
    return createBugError(new Error(error))
  }

  if (!(error instanceof TestOpenApiError)) {
    return createBugError(error)
  }

  // Bug errors do not have `properties`
  Object.assign(error, properties)

  return error
}

// Any error not using `TestOpenApiError` is a bug
const createBugError = function({ stack }) {
  return new TestOpenApiError(`${BUG_MESSAGE}\n\n${stack}`, { type: 'bug' })
}

const BUG_MESSAGE = `A bug in 'test-openapi' occured.
Please report this bug on https://github.com/Cardero-X/test-openapi/issues and paste the following lines:

OS: ${platform()}
node.js: ${nodeVersion}
test-openapi: ${libraryVersion}`

module.exports = {
  normalizeError,
}
