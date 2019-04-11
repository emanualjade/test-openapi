import { removePrefixes } from '../../../../utils/prefix.js'

// Add `query` request parameters to the request URL
export const addQueryParams = function({ url, rawRequest }) {
  const query = removePrefixes(rawRequest, 'query')
  const queryA = Object.entries(query)

  if (queryA.length === 0) {
    return url
  }

  const queryB = queryA.map(encodeQueryParam).join('&')

  return `${url}?${queryB}`
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
