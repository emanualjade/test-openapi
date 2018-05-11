'use strict'

const { getContentNegotiations } = require('../content_negotiation')
const { normalizeSchema } = require('../json_schema')
const { mergeInputs } = require('../merge')
const { getSecChoices } = require('./security')
const { getTestRequest } = require('./test_opts')

// Retrieve HTTP request parameters
const getRequests = function({
  operationObject,
  operationObject: { parameterObjects, produces, consumes },
  testOpts,
}) {
  const contentNegotiations = getContentNegotiations({ contentType: consumes, accept: produces })

  const request = parameterObjects.map(getParam)

  const testRequest = getTestRequest({ testOpts })

  const { secChoices, testRequest: testRequestA } = getSecChoices({ operationObject, testRequest })

  // Returns an alternative of request parameters, each with a different possible set of
  // `secRequest` (randomly picked for each HTTP request)
  const requests = secChoices.map(secRequest =>
    mergeRequest({ contentNegotiations, secRequest, request, testRequest: testRequestA }),
  )

  return requests
}

// From OpenAPI request `parameters` to normalized format
const getParam = function({ name, in: location, required = false, schema, collectionFormat }) {
  const schemaA = normalizeSchema({ schema })
  return { name, location, required, schema: schemaA, collectionFormat }
}

const mergeRequest = function({ contentNegotiations, secRequest, request, testRequest }) {
  const inputs = [...contentNegotiations, ...secRequest, ...request, ...testRequest]
  const requestA = mergeInputs({ inputs })
  return requestA
}

module.exports = {
  getRequests,
}
