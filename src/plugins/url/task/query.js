'use strict'

// Add `query` request parameters to the request URL
const addQueryParams = function({ url, rawRequest }) {
  const query = Object.entries(rawRequest)
    .filter(([name]) => QUERY_PREFIX.test(name))
    .map(encodeQueryParam)

  if (query.length === 0) {
    return url
  }

  return `${url}?${query.join('&')}`
}

// We cannot use `querystring` core module or `qs` library because they does
// not support OpenAPI's `collectionFormat`
const encodeQueryParam = function([name, value]) {
  const nameA = name.replace(QUERY_PREFIX, '')

  // Matches what RFC 3986 prescribes
  const valueA = encodeURIComponent(value)

  return `${nameA}=${valueA}`
}

const QUERY_PREFIX = /^query\./

module.exports = {
  addQueryParams,
}
