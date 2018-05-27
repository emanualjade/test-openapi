'use strict'

const { normalizeUrl } = require('../../../utils')

const { getPath } = require('./path')
const { addUrlParams } = require('./params')
const { addQueryParams } = require('./query')
const { addServer } = require('./server')

// Build request URL from request parameters
const addFullUrl = function({ rawRequest, config }) {
  const url = getFullUrl({ rawRequest, config })
  return { ...rawRequest, url }
}

const getFullUrl = function({ rawRequest, config }) {
  const path = getPath({ rawRequest })
  const pathA = addUrlParams({ path, rawRequest })
  const pathB = addQueryParams({ path: pathA, rawRequest })
  const url = addServer({ config, path: pathB })
  const urlA = normalizeUrl({ url })
  return urlA
}

module.exports = {
  addFullUrl,
}
