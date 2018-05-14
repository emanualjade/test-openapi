'use strict'

const { mapKeys, mapValues } = require('lodash')

const { DEFAULT_STATUS_CODE } = require('../../constants')
const { mergeResponse } = require('../../merge')
const { normalizeSchema } = require('./json_schema')
const { getContentNegotiationsResponse } = require('./content_negotiation')

// Normalize OpenAPI responses into specification-agnostic format
const normalizeResponses = function({ responses, spec, operation }) {
  const responsesA = mapKeys(responses, normalizeStatusCode)
  const responsesB = mapValues(responsesA, response =>
    normalizeResponse({ response, spec, operation }),
  )
  return responsesB
}

const normalizeStatusCode = function(response, statusCode) {
  if (statusCode === 'default') {
    return String(DEFAULT_STATUS_CODE)
  }

  return statusCode
}

const normalizeResponse = function({ response, spec, operation }) {
  const body = getResponseBody({ response })
  const headers = getResponseHeaders({ response, spec, operation })
  return { body, headers }
}

const getResponseBody = function({ response: { schema = {} } }) {
  return normalizeSchema({ schema })
}

const getResponseHeaders = function({ response: { headers = {} }, spec, operation }) {
  const headersA = Object.entries(headers).map(getResponseHeader)

  const contentNegotiations = getContentNegotiationsResponse({ spec, operation })

  const headersB = mergeResponse([...contentNegotiations, ...headersA])

  return headersB
}

const getResponseHeader = function([name, { collectionFormat, ...schema }]) {
  const schemaA = normalizeSchema({ schema })

  return { name, schema: schemaA, collectionFormat }
}

module.exports = {
  normalizeResponses,
}
