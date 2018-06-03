'use strict'

// Only keep `task.request|response.raw` in errors
// Also enforce properties order
const error = function({ request, response }) {
  const requestA = getRequest({ request })
  const responseA = getResponse({ response })
  return { ...requestA, ...responseA }
}

const getRequest = function({ request: { raw } = {} }) {
  if (raw === undefined) {
    return
  }

  const { method, url, server, path, query, headers } = raw
  const request = { method, url, server, path, query, headers }
  return { request }
}

const getResponse = function({ response: { raw } = {} }) {
  if (raw === undefined) {
    return
  }

  const { status, headers, body } = raw
  const response = { status, headers, body }
  return { response }
}

module.exports = {
  error,
}
