import { getServer } from './server.js'
import { addPath } from './path.js'
import { addUrlParams } from './params.js'
import { normalizeUrl } from './normalize.js'
import { addQueryParams } from './query.js'

// Build request URL from request parameters
export const addUrl = function({ call, call: { request, rawRequest } = {} }) {
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
