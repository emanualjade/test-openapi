const { mapValues, mapKeys, omit } = require('lodash')

const { normalizeSchema } = require('./json_schema')
const { getNegotiationsResponse } = require('./content_negotiation')

// Normalize OpenAPI responses into specification-agnostic format
const normalizeResponses = function({
  spec,
  operation,
  operation: { responses },
}) {
  return mapValues(responses, response =>
    normalizeResponse({ response, spec, operation }),
  )
}

const normalizeResponse = function({ response, spec, operation }) {
  const body = getResponseBody({ response })
  const headers = getResponseHeaders({ response, spec, operation })
  return { body, ...headers }
}

const getResponseBody = function({ response: { schema = {} } }) {
  return normalizeSchema({ schema })
}

const getResponseHeaders = function({
  response: { headers = {} },
  spec,
  operation,
}) {
  const headersA = mapValues(headers, getResponseHeader)

  const contentNegotiations = getNegotiationsResponse({ spec, operation })
  const headersB = { ...contentNegotiations, ...headersA }

  const headersC = mapKeys(headersB, normalizeHeaderKey)
  return headersC
}

const getResponseHeader = function(value) {
  // We do not support `header` `collectionFormat`
  const schema = omit(value, 'collectionFormat')

  const schemaA = normalizeSchema({ schema })
  return schemaA
}

const normalizeHeaderKey = function(value, name) {
  const nameA = name.toLowerCase()
  return `headers.${nameA}`
}

module.exports = {
  normalizeResponses,
}
