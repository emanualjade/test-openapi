'use strict'

const { version: nodeVersion } = require('process')
const { platform } = require('os')

const { version: libraryVersion } = require('../../package')

const { TestOpenApiError } = require('./error')

// Any error not using `TestOpenApiError` is a bug
const handleBugs = function({ error }) {
  const bugError = findBugError({ error })
  if (bugError === undefined) {
    return error
  }

  const message = getBugMessage({ bugError })

  const { module } = bugError
  return new TestOpenApiError(message, { module, bug: true })
}

const findBugError = function({ error, error: { errors = [error] } }) {
  return errors.find(isBugError)
}

const isBugError = function({ name }) {
  return name !== 'TestOpenApiError'
}

const getBugMessage = function({ bugError, bugError: { message, stack = message } }) {
  const repositoryName = getRepositoryName({ bugError })

  return `A bug occurred.
Please report an issue on the '${repositoryName}' code repository and paste the following lines:

OS: ${platform()}
node.js: ${nodeVersion}
test-openapi: ${libraryVersion}

${stack}`
}

const getRepositoryName = function({ bugError: { module } }) {
  if (module === undefined) {
    return DEFAULT_REPOSITORY
  }

  return `${MODULE_REPOSITORY}${module}`
}

const DEFAULT_REPOSITORY = 'test-openapi'
const MODULE_REPOSITORY = 'test-openapi-'

module.exports = {
  handleBugs,
  isBugError,
}
