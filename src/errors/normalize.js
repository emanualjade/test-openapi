'use strict'

const { version: nodeVersion } = require('process')
const { platform } = require('os')

const { version: libraryVersion } = require('../../package')

const { ERROR_SYM } = require('./throw')

// Normalize any error to our specific format
const normalizeError = function({ error, properties = {} }) {
  if (!(error instanceof Error)) {
    return createBugError(error)
  }

  if (error[ERROR_SYM] !== true) {
    return createBugError(error.stack)
  }

  Object.assign(error, properties)

  return error
}

// Any error not using `throwError()` is a bug
const createBugError = function(message) {
  const messageA = `A bug in 'test-openapi' occured.
Please report this bug on https://github.com/Cardero-X/test-openapi/issues and paste the following lines:

OS: ${platform()}
node.js: ${nodeVersion}
test-openapi: ${libraryVersion}

${message}`

  const error = new Error(messageA)

  Object.assign(error, { type: 'bug', [ERROR_SYM]: true })

  return error
}

module.exports = {
  normalizeError,
}
