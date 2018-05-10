'use strict'

const { mapKeys, mapValues, merge, pickBy } = require('lodash')

const { addContentNegotiationsHeaders } = require('../content_negotiation')
const { normalizeSchema } = require('../json_schema')

// Retrieve test's expected response headers
const getSpecResHeaders = function({
  headers = {},
  operationObject: { consumes, produces },
  testOpts,
}) {
  const headersA = normalizeHeaders({ headers })

  const testHeaders = getTestHeaders({ testOpts })

  // Deep merge `response.headers` and `test.response.headers`
  const headersB = merge({}, headersA, testHeaders)

  const headersC = arrifyHeaders({ headers: headersB })

  const headersD = addContentNegotiationsHeaders({ headers: headersC, produces, consumes })

  return headersD
}

// We use the `test.response['headers.NAME']` notation instead of
// `test.response.headers.NAME` because it aligns headers with other properties
// of the same nesting level. It also prevents too much nesting, which makes
// the file looks more complicated than it is
const getTestHeaders = function({ testOpts: { response = {} } }) {
  const testHeaders = pickBy(response, isTestHeader)
  const testHeadersA = mapKeys(testHeaders, removePrefix)
  const testHeadersB = normalizeHeaders({ headers: testHeadersA })
  return testHeadersB
}

const isTestHeader = function(value, name) {
  return name.startsWith(HEADERS_PREFIX)
}

const removePrefix = function(value, name) {
  return name.replace(HEADERS_PREFIX, '')
}

// We use `test.response['headers.NAME']` notation
const HEADERS_PREFIX = 'headers.'

const normalizeHeaders = function({ headers }) {
  const headersA = mapKeys(headers, (_, name) => name.toLowerCase())
  const headersB = mapValues(headersA, normalizeHeader)
  return headersB
}

const normalizeHeader = function({ collectionFormat, ...schema }) {
  const schemaA = normalizeSchema({ schema })

  return { schema: schemaA, collectionFormat }
}

const arrifyHeaders = function({ headers }) {
  return Object.entries(headers).map(([name, header]) => ({ ...header, name }))
}

module.exports = {
  getSpecResHeaders,
}
