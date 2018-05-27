'use strict'

const { normalizeUrl } = require('../../../utils')

const { addUrlParams } = require('./params')
const { addQueryParams } = require('./query')

// Build request URL from request parameters
const addFullUrl = function({ rawRequest, config, operation }) {
  const url = getFullUrl({ rawRequest, config, operation })
  return { ...rawRequest, url }
}

const getFullUrl = function({ rawRequest, config: { server }, operation: { path } }) {
  const pathA = addUrlParams({ path, rawRequest })
  const pathB = addQueryParams({ path: pathA, rawRequest })
  const url = `${server}${pathB}`
  const urlA = normalizeUrl({ url })
  return urlA
}

module.exports = {
  addFullUrl,
}
