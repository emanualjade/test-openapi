'use strict'

const { addErrorHandler, throwResponseError } = require('../../../../errors')

// Parse a HTTP response
const getFetchResponse = async function({ rawResponse, rawResponse: { status } }) {
  const headers = getHeaders({ rawResponse })
  const body = await eGetBody({ rawResponse })

  return { status, headers, body }
}

// Normalize response headers to a plain object
const getHeaders = function({ rawResponse: { headers } }) {
  const headersA = [...headers.entries()]
  const headersB = headersA.map(([name, value]) => ({ [name]: value }))
  const headersC = Object.assign({}, ...headersB)
  return headersC
}

// We get the raw body. It will be parsed according to the `Content-Type` later
const getBody = function({ rawResponse }) {
  return rawResponse.text()
}

const getBodyHandler = function({ message }) {
  const property = 'response.body'
  throwResponseError(`Could not read response body: ${message}`, { property })
}

const eGetBody = addErrorHandler(getBody, getBodyHandler)

module.exports = {
  getFetchResponse,
}
