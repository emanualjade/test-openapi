'use strict'

const { DEFAULT_STATUS_CODE } = require('../../constants')

// Retrieve test's expected response HTTP status code
const getResponseStatus = function({
  testOpts: { response: { status = DEFAULT_STATUS_CODE } = {} },
}) {
  return status
}

module.exports = {
  getResponseStatus,
}
