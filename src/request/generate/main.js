'use strict'

const {
  random: { pick },
} = require('json-schema-faker')

const { stringifyRequest } = require('../../format')

const { fakeValues } = require('./fake')
const { fakeContentType } = require('./content_type')

// Generates random request parameters based on JSON schema
const generateRequest = function({ requests }) {
  // OpenAPI specification allows an alternative of sets of authentication-related
  // request parameters. We randomly pick one among the ones specified in `x-tests.*`
  const request = pick(requests)

  const requestA = fakeValues({ request })

  const { request: requestB, contentType } = fakeContentType({ request: requestA })

  const requestC = stringifyRequest({ request: requestB, contentType })

  return requestC
}

module.exports = {
  generateRequest,
}
