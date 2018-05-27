'use strict'

const { normalizeUrl } = require('../../utils')

const { addPathRequest } = require('./path')
const { addQueryRequest } = require('./query')

// Build request URL from OpenAPI specification request `parameters`
const getRequestUrl = function({ path, request, opts }) {
  const pathA = addPathRequest({ path, request })
  const urlA = normalizeRequestUrl({ opts, path: pathA })
  const urlB = addQueryRequest({ url: urlA, request })
  return urlB
}

const normalizeRequestUrl = function({ opts: { server }, path }) {
  const url = `${server}${path}`

  return normalizeUrl({ url })
}

module.exports = {
  getRequestUrl,
}
