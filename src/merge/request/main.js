'use strict'

const { mergeInputs } = require('../common')
const { getSecChoices } = require('./security')
const { getTestRequest } = require('./test_opts')

// Merge HTTP request parameters to specification
const mergeRequests = function({
  test: {
    operation,
    operation: { parameters },
    testOpts,
  },
}) {
  const testRequest = getTestRequest({ testOpts })

  const { secChoices, testRequest: testRequestA } = getSecChoices({ operation, testRequest })

  // Returns an alternative of request parameters, each with a different possible set of
  // `secRequest` (randomly picked for each HTTP request)
  const requests = secChoices.map(secRequest =>
    mergeRequest({ secRequest, parameters, testRequest: testRequestA }),
  )

  return requests
}

const mergeRequest = function({ secRequest, parameters, testRequest }) {
  const items = [...secRequest, ...parameters, ...testRequest]
  const request = mergeInputs({ items })
  return request
}

module.exports = {
  mergeRequests,
}
