'use strict'

const { fakeValues } = require('./fake')
const { fakeContentType } = require('./content_type')

// Generates random request parameters based on JSON schema
const generateRequest = function({ request }) {
  const requestA = fakeValues({ request })

  const requestB = fakeContentType({ request: requestA })

  return requestB
}

module.exports = {
  generateRequest,
}
