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
  const headers = pickBy(rawRequest, (value, name) => name.startsWith('headers.'))
  const headersA = mapKeys(headers, (value, name) => name.replace(/^headers./, ''))
  return headersA
}

module.exports = {
  getFetchParams,
}
