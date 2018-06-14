'use strict'

const { getServer } = require('./server')
const { addPath } = require('./path')
const { addUrlParams } = require('./params')
const { normalizeUrl } = require('./normalize')
const { addQueryParams } = require('./query')

// Build request URL from request parameters
const task = function({
  call,
  call: {
    request,
    request: { raw: rawRequest },
  },
  config,
}) {
  const url = getFullUrl({ rawRequest, config })
  const requestA = { ...request, raw: { ...rawRequest, url } }

  return { call: { ...call, request: requestA } }
}

const getFullUrl = function({ rawRequest, config }) {
  const url = getServer({ rawRequest, config })
  const urlA = addPath({ url, rawRequest })
  const urlB = addUrlParams({ url: urlA, rawRequest })
  const urlC = normalizeUrl({ url: urlB })
  const urlD = addQueryParams({ url: urlC, rawRequest })
  return urlD
}

module.exports = {
  task,
}
