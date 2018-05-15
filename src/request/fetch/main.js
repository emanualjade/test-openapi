'use strict'

const fetch = require('cross-fetch')

const { addErrorHandler, throwConnectError } = require('../../errors')

const { getRequestUrl } = require('./url')
const { getRequestHeaders } = require('./headers')
const { getRequestBody } = require('./body')
const { handleResponse } = require('./response')

// Actual HTTP request
const doFetch = async function({ method, path, request, opts, opts: { dry } }) {
  const fetchRequest = getFetchRequest({ method, path, request, opts })

  if (dry) {
    return { fetchRequest }
  }

  const fetchResponse = await eFireFetch({ ...fetchRequest, opts })

  const fetchResponseA = await handleResponse({ fetchResponse })

  return { fetchResponse: fetchResponseA, fetchRequest }
}

// Retrieve HTTP request's URL, headers and body
const getFetchRequest = function({ method, path, request, opts }) {
  const url = getRequestUrl({ path, request, opts })
  const headers = getRequestHeaders({ request })
  const body = getRequestBody({ request })

  return { url, method, headers, body }
}

// Actual HTTP request
const fireFetch = function({ url, method, headers, body, opts: { timeout } }) {
  return fetch(url, { method, headers, body, timeout })
}

const fireFetchHandler = function(error, { url, opts: { timeout } }) {
  const message = getFetchError({ error, url, timeout })
  throwConnectError(message)
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

const eFireFetch = addErrorHandler(fireFetch, fireFetchHandler)

module.exports = {
  doFetch,
}
