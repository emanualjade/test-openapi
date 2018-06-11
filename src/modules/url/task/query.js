'use strict'

// Add `query` request parameters to the request URL
const addQueryParams = function({ url, rawRequest: { query } }) {
  if (query === undefined) {
    return url
  }

  const queryA = Object.entries(query)
    .map(encodeQueryParam)
    .join('&')

  return `${url}?${queryA}`
}

// We cannot use `querystring` core module or `qs` library because we want to
// support the `&=` notation
const encodeQueryParam = function([name, value]) {
  if (value.includes(MULTI_SEPARATOR)) {
    return encodeMultiQuery({ name, value })
  }

  return encodeParam({ name, value })
}

// `task.query.NAME: VAL&=VAL2&=VAL3` is a special notation to convert to
// `?NAME=VAL&NAME=VAL2&NAME=VAL3`
const encodeMultiQuery = function({ name, value }) {
  return value
    .split(MULTI_SEPARATOR)
    .map(valueA => encodeParam({ name, value: valueA }))
    .join('&')
}

const MULTI_SEPARATOR = '&='

const encodeParam = function({ name, value }) {
  // Matches what RFC 3986 prescribes
  const valueA = encodeURIComponent(value)

  return `${name}=${valueA}`
}

module.exports = {
  addQueryParams,
}
