'use strict'

const { mapKeys, mapValues, merge } = require('lodash')

const { addContentNegotiationsHeaders } = require('../content_negotiation')
const { normalizeSchema } = require('../json_schema')

// Retrieve test's expected response headers
const getSpecResHeaders = function({
  headers = {},
  operationObject: { consumes, produces },
  testOpts: { response: { headers: testHeaders } = {} },
}) {
  const headersA = normalizeHeaders({ headers })
  const testHeadersA = normalizeHeaders({ headers: testHeaders })

  // Deep merge `response.headers` and `testOpts.response.headers`
  const headersB = merge({}, headersA, testHeadersA)

  const headersC = arrifyHeaders({ headers: headersB })

  const headersD = addContentNegotiationsHeaders({ headers: headersC, produces, consumes })

  return headersD
}

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
  return Object.entries(headers).map(([name, { schema, collectionFormat }]) => ({
    name,
    schema,
    collectionFormat,
  }))
}

module.exports = {
  getSpecResHeaders,
}
