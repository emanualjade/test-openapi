'use strict'

const { getMethod } = require('./method')
const { getServer } = require('./server')
const { addPath } = require('./path')
const { addUrlParams } = require('./params')
const { normalizeUrl } = require('./normalize')
const { addQueryParams } = require('./query')

// Build request URL from request parameters
const addFullUrl = function({
  call,
  call: {
    request,
    request: { raw: rawRequest },
  },
}) {
  const method = getMethod({ rawRequest })
  const url = getFullUrl({ rawRequest })
  const rawRequestA = { ...rawRequest, url, method }

  const requestA = { ...request, raw: rawRequestA }
  return { call: { ...call, request: requestA } }
}

const getFullUrl = function({ rawRequest }) {
  const url = getServer({ rawRequest })
  const urlA = addPath({ url, rawRequest })
  const urlB = addUrlParams({ url: urlA, rawRequest })
  const urlC = normalizeUrl({ url: urlB })
  const urlD = addQueryParams({ url: urlC, rawRequest })
  return urlD
}

module.exports = {
  addFullUrl,
}
