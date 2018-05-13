'use strict'

const fetch = require('cross-fetch')

const { getRequestUrl } = require('./url')
const { getRequestHeaders } = require('./headers')
const { getRequestBody } = require('./body')
const { handleResponse } = require('./response')

// Actual HTTP request
const doFetch = async function({ method, path, request, opts }) {
  const fetchRequest = getFetchRequest({ method, path, request, opts })

  const fetchResponse = await fireFetch({ ...fetchRequest, opts })

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
const fireFetch = async function({ url, method, headers, body, opts: { timeout } }) {
  try {
    return await fetch(url, { timeout, method, headers, body })
  } catch (error) {
    throw new Error(`Could not connect to ${url}: ${error.message}`)
  }
}

module.exports = {
  doFetch,
}
