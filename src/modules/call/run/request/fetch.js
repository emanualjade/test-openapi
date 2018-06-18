'use strict'

const fetch = require('cross-fetch')

const { removePrefixes } = require('../../../../utils')
const { addErrorHandler, TestOpenApiError } = require('../../../../errors')

const fireRequest = function({ rawRequest: { method, url, body, ...rest }, timeout }) {
  const headers = removePrefixes(rest, 'headers')
  return eFireFetch({ url, method, headers, body, timeout })
}

const fireFetch = function({ url, method, headers, body, timeout }) {
  return fetch(url, { method, headers, body, timeout })
}

const fireFetchHandler = function({ message, type }, { rawRequest: { url }, timeout }) {
  if (type === 'request-timeout') {
    throw new TestOpenApiError(`The request to '${url}' took more than ${timeout} milliseconds`)
  }

  throw new TestOpenApiError(`Could not connect to '${url}': ${message}`)
}

const eFireFetch = addErrorHandler(fireFetch, fireFetchHandler)

module.exports = {
  fireRequest,
}
