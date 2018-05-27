'use strict'

const { version: nodeVersion } = require('process')
const { platform } = require('os')

const { version: libraryVersion } = require('../../package')

const { TestOpenApiError } = require('./error')
const { bundleErrors } = require('./bundle')

// Add `error.config` and `error.errors` to every error
// Also mark exceptions that are probably bugs as such
const topLevelHandler = function(error, config = {}) {
  const errorA = Object.assign(error, { config })
  const errorB = bundleSingleError({ error: errorA })
  const errorC = handleBugs({ error: errorB })
  throw errorC
}

// Bundle single error with `bundleErrors()` unless it's already bundled
const bundleSingleError = function({ error }) {
  if (error.errors) {
    return error
  }

  return bundleErrors({ errors: [error] })
}

// Any error not using `TestOpenApiError` is a bug
const handleBugs = function({ error }) {
  const bugError = findBugError({ error })
  if (bugError === undefined) {
    return error
  }

  return new TestOpenApiError(`${BUG_MESSAGE}\n\n${bugError.stack}`, { plugin: 'bug' })
}

const findBugError = function({ error: { errors } }) {
  return errors.find(error => error.name !== 'TestOpenApiError')
}

const BUG_MESSAGE = `A bug in 'test-openapi' occured.
Please report this bug on https://github.com/Cardero-X/test-openapi/issues and paste the following lines:

OS: ${platform()}
node.js: ${nodeVersion}
test-openapi: ${libraryVersion}`

module.exports = {
  topLevelHandler,
}
