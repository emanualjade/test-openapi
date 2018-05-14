'use strict'

const { mergeInputs } = require('../common')
const { getTestRequest } = require('./test_opts')

// Merge HTTP request parameters to specification
const mergeRequest = function({
  test: {
    operation: { parameters },
    testOpts,
  },
}) {
  const testRequest = getTestRequest({ testOpts })

  const items = [...parameters, ...testRequest]
  const request = mergeInputs({ items, isRequest: true })

  return request
}

module.exports = {
  mergeRequest,
}
