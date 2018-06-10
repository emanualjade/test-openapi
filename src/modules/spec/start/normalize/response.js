'use strict'

const { mapValues, mapKeys, omit } = require('lodash')

const { normalizeSchema } = require('./json_schema')
const { getNegotiationsResponse } = require('./content_negotiation')

// Normalize OpenAPI responses into specification-agnostic format
const normalizeResponses = function({ responses, spec, operation }) {
  return mapValues(responses, response => normalizeResponse({ response, spec, operation }))
}

const normalizeResponse = function({ response, spec, operation }) {
  const body = getResponseBody({ response })
  const headers = getResponseHeaders({ response, spec, operation })
  return { body, ...headers }
}

const getResponseBody = function({ response: { schema = {} } }) {
  return normalizeSchema({ schema })
}

const getResponseHeaders = function({ response: { headers = {} }, spec, operation }) {
  const headersA = mapValues(headers, getResponseHeader)

  const contentNegotiations = getNegotiationsResponse({ spec, operation })
  const headersB = { ...contentNegotiations, ...headersA }

  const headersC = mapKeys(headersB, addHeaderPrefix)
  return headersC
}

const getResponseHeader = function(value) {
  // We do not support `header` `collectionFormat`
  const schema = omit(value, 'collectionFormat')

  const schemaA = normalizeSchema({ schema })
  return schemaA
}

const addHeaderPrefix = function(value, name) {
  return `headers.${name}`
}

module.exports = {
  normalizeResponses,
}
