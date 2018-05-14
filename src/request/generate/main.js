'use strict'

const { stringifyRequest } = require('../../format')

const { fakeValues } = require('./fake')
const { fakeContentType } = require('./content_type')

// Generates random request parameters based on JSON schema
const generateRequest = function({ request }) {
  const requestA = fakeValues({ request })

  const { request: requestB, contentType } = fakeContentType({ request: requestA })

  const requestC = stringifyRequest({ request: requestB, contentType })

  return requestC
}

module.exports = {
  generateRequest,
}
