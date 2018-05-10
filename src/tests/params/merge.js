'use strict'

const { mergeInputs } = require('../merge')

// Deeply merge request parameters with the same `name` and `location`
const mergeParams = function({ specReqParams, secChoices, contentNegotiations, testParams }) {
  // Returns an alternative of parameters, each with a different possible set of `secParams`
  // (randomly picked for each HTTP request)
  return secChoices.map(secParams =>
    mergeEachParams({ specReqParams, secParams, contentNegotiations, testParams }),
  )
}

const mergeEachParams = function({ specReqParams, secParams, contentNegotiations, testParams }) {
  const inputs = [...contentNegotiations, ...secParams, ...specReqParams, ...testParams]
  const params = mergeInputs({ inputs })
  return params
}

module.exports = {
  mergeParams,
}
