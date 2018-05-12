'use strict'

// Parse a HTTP response
const handleResponse = async function({ fetchResponse }) {
  const status = getStatus({ fetchResponse })
  const headers = getHeaders({ fetchResponse })
  const body = await getBody({ fetchResponse })

  return { status, headers, body }
}

const getStatus = function({ fetchResponse: { status } }) {
  return status
}

// Normalize response headers to a plain object
const getHeaders = function({ fetchResponse: { headers } }) {
  const headersA = [...headers.entries()]
  const headersB = headersA.map(([name, value]) => ({ [name.toLowerCase()]: value }))
  const headersC = Object.assign({}, ...headersB)
  return headersC
}

// We get the raw body. It will be parsed according to the `Content-Type` later
const getBody = async function({ fetchResponse }) {
  try {
    return await fetchResponse.text()
  } catch (error) {
    throw new Error(`Could not read response body: ${error.message}`)
  }
}

module.exports = {
  handleResponse,
}
