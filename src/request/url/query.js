'use strict'

const { filterParams } = require('../utils')

// Add `query` parameters to request URL
const addQueryParams = function({ url, params }) {
  const queryParams = filterParams({ params, location: 'query' })
  if (queryParams.length === 0) {
    return url
  }

  const query = encodeQueryParams({ queryParams })
  return `${url}?${query}`
}

// We cannot use `querystring` core module or `qs` library because they does
// not support OpenAPI's `collectionFormat`
const encodeQueryParams = function({ queryParams }) {
  return queryParams.map(encodeQueryParam).join('&')
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
  addQueryParams,
}
