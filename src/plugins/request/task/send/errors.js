'use strict'

const { TestOpenApiError } = require('../../../../errors')

const sendRequestHandler = function(
  error,
  {
    rawRequest: { url },
    config: {
      request: { timeout },
    },
  },
) {
  const message = getFetchError({ error, url, timeout })
  throw new TestOpenApiError(message)
}

const getFetchError = function({ error: { message, type }, url, timeout }) {
  if (type === 'request-timeout') {
    return `The request took more than ${timeout} milliseconds`
  }

  if (type === 'body-timeout') {
    return `Parsing the response took more than ${timeout} milliseconds`
  }

  return `Could not connect to ${url}: ${message}`
}

module.exports = {
  sendRequestHandler,
}
