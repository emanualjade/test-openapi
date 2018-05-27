'use strict'

const { normalizeUrl } = require('../../../utils')

const { addPathParam } = require('./path')
const { addQueryParam } = require('./query')

// Build request URL from OpenAPI specification request `parameters`
const addUrlParam = function({ rawRequest, config: { server }, operation: { path } }) {
  const url = getUrlParam({ rawRequest, server, path })
  return { ...rawRequest, url }
}

const getUrlParam = function({ rawRequest, server, path }) {
  const pathA = addPathParam({ path, rawRequest })
  const pathB = addQueryParam({ path: pathA, rawRequest })
  const url = `${server}${pathB}`
  const urlA = normalizeUrl({ url })
  return urlA
}

module.exports = {
  addUrlParam,
}
