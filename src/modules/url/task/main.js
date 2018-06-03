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
  titles,
}) {
  const method = getMethod({ rawRequest })
  const { shortUrl, url } = getFullUrl({ rawRequest })
  const rawRequestA = { ...rawRequest, url, method }
  const requestA = { ...request, raw: rawRequestA }

  const titlesA = addTitle({ method, shortUrl, titles })

  return { call: { ...call, request: requestA }, titles: titlesA }
}

const getFullUrl = function({ rawRequest }) {
  const url = getServer({ rawRequest })
  const urlA = addPath({ url, rawRequest })
  const urlB = addUrlParams({ url: urlA, rawRequest })
  const urlC = normalizeUrl({ url: urlB })
  const urlD = addQueryParams({ url: urlC, rawRequest })
  return { shortUrl: urlC, url: urlD }
}

// Add HTTP method and URL in reporting
const addTitle = function({ method, shortUrl, titles }) {
  const title = `${method.toUpperCase()} ${shortUrl}`
  return [...titles, title]
}

module.exports = {
  addFullUrl,
}
