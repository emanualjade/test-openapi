'use strict'

const {
  random: { pick },
} = require('json-schema-faker')

const { stringifyParams } = require('../../format')

const { fakeValues } = require('./fake')
const { fakeContentType } = require('./content_type')

// Generates random parameters based on JSON schema
const generateParams = function({ specReqParams: params }) {
  // OpenAPI specification allows an alternative of sets of authentication-related
  // request parameters. We randomly pick one among the ones specified in `x-tests.*`
  const paramsA = pick(params)

  const paramsB = fakeValues({ params: paramsA })

  const { params: paramsC, contentType } = fakeContentType({ params: paramsB })

  const paramsD = stringifyParams({ params: paramsC, contentType })

  return paramsD
}

module.exports = {
  generateParams,
}
