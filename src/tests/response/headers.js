'use strict'

const { omit } = require('lodash')

const { getContentNegotiations } = require('../content_negotiation')
const { normalizeSchema } = require('../json_schema')
const { mergeInputs } = require('../merge')

// Retrieve test's expected response headers
const getResponseHeaders = function({
  headers = {},
  operationObject: { consumes, produces },
  testOpts,
}) {
  const contentNegotiations = getContentNegotiationsHeaders({ produces, consumes })

  const headersA = normalizeHeaders({ headers })

  const testHeaders = getTestHeaders({ testOpts })

  const inputs = [...contentNegotiations, ...headersA, ...testHeaders]
  const headersD = mergeInputs({ inputs })

  return headersD
}

const normalizeHeaders = function({ headers }) {
  return Object.entries(headers).map(normalizeHeader)
}

const normalizeHeader = function([name, { collectionFormat, ...schema }]) {
  const nameA = name.toLowerCase()
  const schemaA = normalizeSchema({ schema })

  return { name: nameA, schema: schemaA, collectionFormat }
}

// We use the `test.response['headers.NAME']` notation instead of
// `test.response.headers.NAME` because it aligns headers with other properties
// of the same nesting level. It also prevents too much nesting, which makes
// the file looks more complicated than it is
const getTestHeaders = function({ testOpts: { response = {} } }) {
  return Object.entries(response)
    .filter(isTestHeader)
    .map(getTestHeader)
}

const isTestHeader = function([name, value]) {
  return name.startsWith(HEADERS_PREFIX)
}

const getTestHeader = function([name, schema]) {
  const nameA = name.replace(HEADERS_PREFIX, '').toLowerCase()

  return { name: nameA, schema }
}

// We use `test.response['headers.NAME']` notation
const HEADERS_PREFIX = 'headers.'

// Get content negotiation response headers
const getContentNegotiationsHeaders = function({ produces, consumes }) {
  const contentNegotiations = getContentNegotiations({ contentType: produces, accept: consumes })
  const contentNegotiationsA = contentNegotiations.map(contentNegotiation =>
    omit(contentNegotiation, 'location'),
  )
  return contentNegotiationsA
}

module.exports = {
  getResponseHeaders,
}
