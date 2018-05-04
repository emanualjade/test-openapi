'use strict'

const { getContentNegotiations } = require('../content_negotiation')
const { normalizeSchemas } = require('../json_schema')
const { getSecurityParams } = require('./security')
const { getSettingsParams } = require('./settings')
const { mergeParams } = require('./merge')

// Retrieve HTTP request parameters
const getSpecReqParams = function({
  operationObject,
  operationObject: { parameterObjects, produces, consumes },
  settings,
}) {
  const specReqParams = parameterObjects.map(getSpecReqParam)

  const securityParams = getSecurityParams({ operationObject })

  const contentNegotiations = getContentNegotiations({ contentType: consumes, accept: produces })

  const settingsParams = getSettingsParams({ specReqParams, securityParams, settings })

  const specReqParamsA = mergeParams({
    specReqParams,
    securityParams,
    contentNegotiations,
    settingsParams,
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
