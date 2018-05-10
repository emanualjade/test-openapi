'use strict'

const { getContentNegotiations } = require('../content_negotiation')
const { normalizeSchema } = require('../json_schema')
const { getSecChoices } = require('./security')
const { getTestRequest } = require('./test_opts')
const { mergeRequests } = require('./merge')

// Retrieve HTTP request parameters
const getRequests = function({
  operationObject,
  operationObject: { parameterObjects, produces, consumes },
  testOpts,
}) {
  const request = parameterObjects.map(getParam)

  const contentNegotiations = getContentNegotiations({ contentType: consumes, accept: produces })

  const testRequest = getTestRequest({ testOpts })

  const { secChoices, testRequest: testRequestA } = getSecChoices({ operationObject, testRequest })

  const requests = mergeRequests({
    request,
    secChoices,
    contentNegotiations,
    testRequest: testRequestA,
  })
  return requests
}

// From OpenAPI request `parameters` to normalized format
const getParam = function({ name, in: location, required = false, schema, collectionFormat }) {
  const schemaA = normalizeSchema({ schema })
  return { name, location, required, schema: schemaA, collectionFormat }
}

module.exports = {
  getRequests,
}
