'use strict'

const { mergeInputs } = require('../merge')

// Deeply merge request parameters with the same `name` and `location`
const mergeRequests = function({ request, secChoices, contentNegotiations, testRequest }) {
  // Returns an alternative of request parameters, each with a different possible set of
  // `secRequest` (randomly picked for each HTTP request)
  return secChoices.map(secRequest =>
    mergeRequest({ request, secRequest, contentNegotiations, testRequest }),
  )
}

const mergeRequest = function({ request, secRequest, contentNegotiations, testRequest }) {
  const inputs = [...contentNegotiations, ...secRequest, ...request, ...testRequest]
  const requestA = mergeInputs({ inputs })
  return requestA
}

module.exports = {
  mergeRequests,
}
