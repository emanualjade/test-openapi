'use strict'

const fetch = require('cross-fetch')

const { addErrorHandler, TestOpenApiError } = require('../../../errors')

const fireFetch = function({ rawRequest: { method, url, body, headers }, timeout }) {
  return fetch(url, { method, headers, body, timeout })
}

const fireFetchHandler = function(
  { message, type },
  {
    rawRequest: { url },
    config: {
      call: { timeout },
    },
  },
) {
  if (type === 'request-timeout') {
    throw new TestOpenApiError(`The request to '${url}' took more than ${timeout} milliseconds`)
  }

  throw new TestOpenApiError(`Could not connect to '${url}': ${message}`)
}

const eFireFetch = addErrorHandler(fireFetch, fireFetchHandler)

module.exports = {
  fireFetch: eFireFetch,
}
