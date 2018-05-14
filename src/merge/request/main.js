'use strict'

const { mergeTestRequest } = require('../common')
const { getTestRequest } = require('./test_opts')

// Merge HTTP request parameters to specification
const mergeRequest = function({
  test: {
    operation: { parameters },
    testOpts,
  },
}) {
  const testRequest = getTestRequest({ testOpts })

  const request = mergeTestRequest([...parameters, ...testRequest])

  return request
}

module.exports = {
  mergeRequest,
}
