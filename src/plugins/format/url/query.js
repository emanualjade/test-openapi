'use strict'

// Add `query` request parameters to request URL
const addQueryParam = function({ path, rawRequest }) {
  const query = Object.entries(rawRequest)
    .filter(([name]) => QUERY_PREFIX.test(name))
    .map(encodeQueryParam)

  if (query.length === 0) {
    return path
  }

  return `${path}?${query.join('&')}`
}

// We cannot use `querystring` core module or `qs` library because they does
// not support OpenAPI's `collectionFormat`
const encodeQueryParam = function([name, value]) {
  const nameA = name.replace(QUERY_PREFIX, '')
  const valueA = encodeURIComponent(value)
  return `${nameA}=${valueA}`
}

const QUERY_PREFIX = /^query\./

module.exports = {
  addQueryParam,
}
