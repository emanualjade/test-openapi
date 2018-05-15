'use strict'

const { addErrorHandler, throwResponseError } = require('../../errors')

// Parse a HTTP response
const handleResponse = async function({ fetchResponse }) {
  const status = getStatus({ fetchResponse })
  const headers = getHeaders({ fetchResponse })
  const body = await eGetBody({ fetchResponse })

  return { status, headers, body }
}

const getStatus = function({ fetchResponse: { status } }) {
  return status
}

// Normalize response headers to a plain object
const getHeaders = function({ fetchResponse: { headers } }) {
  const headersA = [...headers.entries()]
  const headersB = headersA.map(([name, value]) => ({ [name]: value }))
  const headersC = Object.assign({}, ...headersB)
  return headersC
}

// We get the raw body. It will be parsed according to the `Content-Type` later
const getBody = function({ fetchResponse }) {
  return fetchResponse.text()
}

const getBodyHandler = function({ message }) {
  const property = 'response.body'
  throwResponseError(`Could not read response body: ${message}`, { property })
}

const eGetBody = addErrorHandler(getBody, getBodyHandler)

module.exports = {
  handleResponse,
}
