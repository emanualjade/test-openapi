'use strict'

const { pickBy, mapKeys } = require('lodash')

const getFetchParams = function({
  operation: { method },
  rawRequest: { url, body, ...rawRequest },
  config: { timeout },
}) {
  const headers = getFetchHeaders({ rawRequest })
  const fetchParams = { method, headers, body, timeout }
  return { url, fetchParams }
}

const getFetchHeaders = function({ rawRequest }) {
  const headers = pickBy(rawRequest, (value, name) => HEADERS_PREFIX_REGEXP.test(name))
  const headersA = mapKeys(headers, (value, name) => name.replace(HEADERS_PREFIX_REGEXP, ''))
  return headersA
}

const HEADERS_PREFIX_REGEXP = /^headers./

module.exports = {
  getFetchParams,
}
