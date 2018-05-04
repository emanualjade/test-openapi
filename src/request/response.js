'use strict'

// Parse a HTTP response
const handleResponse = async function({ res }) {
  const resStatus = getResStatus({ res })
  const resHeaders = getResHeaders({ res })
  const resBody = await getResBody({ res })

  return { resStatus, resHeaders, resBody }
}

const getResStatus = function({ res: { status } }) {
  return status
}

// Normalize response headers to a plain object
const getResHeaders = function({ res: { headers } }) {
  const resHeaders = [...headers.entries()]
  const resHeadersA = resHeaders.map(([name, value]) => ({ [name.toLowerCase()]: value }))
  const resHeadersB = Object.assign({}, ...resHeadersA)
  return resHeadersB
}

// We get the raw body. It will be parsed according to the `Content-Type` later
const getResBody = async function({ res }) {
  try {
    return await res.text()
  } catch (error) {
    throw new Error(`Could not read response body: ${error.message}`)
  }
}

module.exports = {
  handleResponse,
}
