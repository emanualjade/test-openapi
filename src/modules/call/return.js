'use strict'

// Only keep `task.request|response.raw` in errors
const returnValue = function({ request, response }) {
  const requestA = getRequest({ request })
  const responseA = getResponse({ response })
  return { ...requestA, ...responseA }
}

const getRequest = function({ request: { raw } = {} }) {
  if (raw === undefined) {
    return
  }

  // Enforce properties order
  const { method, url, server, path, query, headers, body } = raw
  const request = { method, url, server, path, query, headers, body }
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
  returnValue,
}
