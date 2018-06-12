'use strict'

const { addErrorHandler, TestOpenApiError } = require('../../../errors')

// Parse a HTTP response
const getFetchResponse = async function({ rawResponse, rawResponse: { status }, timeout }) {
  const headers = getHeaders({ rawResponse })
  const body = await eGetBody({ rawResponse, timeout })

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

const getBodyHandler = function({ message, type }, { timeout }) {
  const properties = { property: 'call.response.body' }

  if (type === 'body-timeout') {
    throw new TestOpenApiError(
      `Parsing the response body took more than ${timeout} milliseconds`,
      properties,
    )
  }

  throw new TestOpenApiError(`Could not read response body: ${message}`, properties)
}

const eGetBody = addErrorHandler(getBody, getBodyHandler)

module.exports = {
  getFetchResponse,
}
