'use strict'

const { mapKeys, mapValues } = require('lodash')

const { DEFAULT_STATUS_CODE } = require('../../constants')
const { normalizeSchema } = require('./json_schema')
const { addContentNegotiations } = require('./content_negotiation')

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
  const tests = getTests({ response })
  const body = getResponseBody({ response })
  const headers = getResponseHeaders({ response, spec, operation })
  return { tests, body, headers }
}

const getTests = function({ response: { 'x-tests': tests = {} } }) {
  return Object.entries(tests).map(([testKey, testOpts]) => ({ testKey, testOpts }))
}

const getResponseBody = function({ response: { schema = {} } }) {
  return normalizeSchema({ schema })
}

const getResponseHeaders = function({ response: { headers = {} }, spec, operation }) {
  const headersA = Object.entries(headers).map(getResponseHeader)
  const headersB = addContentNegotiations({ items: headersA, spec, operation, isRequest: false })
  return headersB
}

const getResponseHeader = function([name, { collectionFormat, ...schema }]) {
  const nameA = name.toLowerCase()
  const schemaA = normalizeSchema({ schema })

  return { name: nameA, schema: schemaA, collectionFormat }
}

module.exports = {
  normalizeResponses,
}
