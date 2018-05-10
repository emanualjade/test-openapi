'use strict'

const { getContentNegotiations } = require('../content_negotiation')
const { normalizeSchemas } = require('../json_schema')
const { getSecChoices } = require('./security')
const { getTestParams } = require('./test_opts')
const { mergeParams } = require('./merge')

// Retrieve HTTP request parameters
const getSpecReqParams = function({
  operationObject,
  operationObject: { parameterObjects, produces, consumes },
  testOpts,
}) {
  const specReqParams = parameterObjects.map(getSpecReqParam)

  const contentNegotiations = getContentNegotiations({ contentType: consumes, accept: produces })

  const testParams = getTestParams({ testOpts })

  const { secChoices, testParams: testParamsA } = getSecChoices({ operationObject, testParams })

  const specReqParamsA = mergeParams({
    specReqParams,
    secChoices,
    contentNegotiations,
    testParams: testParamsA,
  })

  const specReqParamsB = normalizeSchemas({ specReqParams: specReqParamsA })

  return specReqParamsB
}

// From OpenAPI `parameters` to normalized format
const getSpecReqParam = function({
  name,
  in: location,
  required = false,
  schema,
  collectionFormat,
}) {
  return { name, location, required, schema, collectionFormat }
}

module.exports = {
  getSpecReqParams,
}
