'use strict'

const { merge } = require('../../../../../utils')
const { getNegotiationsParams } = require('../content_negotiation')

const { normalizeParams } = require('./normalize')
const { normalizeFormData } = require('./form_data')
const { getSecParams } = require('./security')
const { getConstants } = require('./constants')

// Normalize OpenAPI request parameters into specification-agnostic format
const getParams = function({
  spec,
  method,
  path,
  pathDef: { parameters: pathDefParams = [] },
  operation,
  operation: { parameters: params = [] },
}) {
  const paramsA = [...pathDefParams, ...params]

  const paramsB = normalizeParams({ params: paramsA })

  const contentNegotiations = getNegotiationsParams({
    spec,
    operation,
    params: paramsB,
  })

  const paramsC = normalizeFormData({ params: paramsB })

  const secParams = getSecParams({ spec, operation })

  const constants = getConstants({ spec, method, path })

  const paramsD = merge(contentNegotiations, secParams, paramsC, constants)

  return paramsD
}

module.exports = {
  getParams,
}
