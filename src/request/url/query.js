'use strict'

const { filterRequest } = require('../utils')

// Add `query` request parameters to request URL
const addQueryRequest = function({ url, request }) {
  const queryRequest = filterRequest({ request, location: 'query' })
  if (queryRequest.length === 0) {
    return url
  }

  const query = encodeQueryRequest({ queryRequest })
  return `${url}?${query}`
}

// We cannot use `querystring` core module or `qs` library because they does
// not support OpenAPI's `collectionFormat`
const encodeQueryRequest = function({ queryRequest }) {
  return queryRequest.map(encodeQueryParam).join('&')
}

const encodeQueryParam = function({ name, value, collectionFormat }) {
  if (collectionFormat !== 'multi') {
    const valueA = encodeURIComponent(value)
    return `${name}=${valueA}`
  }

  return value
    .split('&')
    .map(encodeURIComponent)
    .join('&')
}

module.exports = {
  addQueryRequest,
}
