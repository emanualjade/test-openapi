'use strict'

const { fakeValues } = require('./fake')
const { fakeContentType } = require('./content_type')

// Generates random request parameters based on JSON schema
const generateParams = function({ params }) {
  const paramsA = fakeValues({ params })

  const paramsB = fakeContentType({ params: paramsA })

  return { params: paramsB }
}

module.exports = {
  generateParams,
}
