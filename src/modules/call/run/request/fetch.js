'use strict'

const fetch = require('cross-fetch')

const { removePrefixes } = require('../../../../utils')
const { addErrorHandler, TestOpenApiError } = require('../../../../errors')

const fireRequest = function({ rawRequest: { method, url, body, ...rest }, timeout }) {
  const headers = removePrefixes(rest, 'headers')
  return fetch(url, { method, headers, body, timeout })
}

const fireRequestHandler = function({ message, type }, { rawRequest: { url }, timeout }) {
  if (type === 'request-timeout') {
    throw new TestOpenApiError(`The request to '${url}' took more than ${timeout} milliseconds`)
  }

  throw new TestOpenApiError(`Could not connect to '${url}': ${message}`)
}

const eFireRequest = addErrorHandler(fireRequest, fireRequestHandler)

module.exports = {
  fireRequest: eFireRequest,
}
