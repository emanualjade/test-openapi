'use strict'

// Add `query` request parameters to the request URL
const addQueryParams = function({ url, rawRequest: { query = {} } }) {
  const queryA = Object.entries(query).map(encodeQueryParam)

  if (queryA.length === 0) {
    return url
  }

  return `${url}?${queryA.join('&')}`
}

// We cannot use `querystring` core module or `qs` library because they does
// not support OpenAPI's `collectionFormat`
const encodeQueryParam = function([name, value]) {
  // Matches what RFC 3986 prescribes
  const valueA = encodeURIComponent(value)

  return `${name}=${valueA}`
}

module.exports = {
  addQueryParams,
}
