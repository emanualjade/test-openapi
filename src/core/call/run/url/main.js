const { getServer } = require('./server')
const { addPath } = require('./path')
const { addUrlParams } = require('./params')
const { normalizeUrl } = require('./normalize')
const { addQueryParams } = require('./query')

// Build request URL from request parameters
const addUrl = function({ call, call: { request, rawRequest } = {} }) {
  if (call === undefined) {
    return
  }

  const url = getFullUrl({ rawRequest })
  const rawRequestA = { ...rawRequest, url }
  const requestA = { ...request, url }

  return { call: { ...call, rawRequest: rawRequestA, request: requestA } }
}

const getFullUrl = function({ rawRequest }) {
  const url = getServer({ rawRequest })
  const urlA = addPath({ url, rawRequest })
  const urlB = normalizeUrl({ url: urlA })
  const urlC = addUrlParams({ url: urlB, rawRequest })
  const urlD = addQueryParams({ url: urlC, rawRequest })
  return urlD
}

module.exports = {
  addUrl,
}
