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

  return new TestOpenApiError(message, { bug: true })
}

const findBugError = function({ error, error: { errors = [error] } }) {
  return errors.find(isBugError)
}

const isBugError = function({ name }) {
  return name !== 'TestOpenApiError'
}

const getBugMessage = function({ bugError, bugError: { stack } }) {
  const repositoryName = getRepositoryName({ bugError })

  return `A bug occurred.
Please report an issue on the '${repositoryName}' code repository and paste the following lines:

OS: ${platform()}
node.js: ${nodeVersion}
test-openapi: ${libraryVersion}

${stack}`
}

const getRepositoryName = function({ bugError: { plugin } }) {
  if (plugin === undefined) {
    return DEFAULT_REPOSITORY
  }

  return `${REPOSITORY_PREFIX}${plugin}`
}

const DEFAULT_REPOSITORY = 'test-openapi'
const REPOSITORY_PREFIX = 'test-openapi-plugin-'

module.exports = {
  handleBugs,
  isBugError,
}
