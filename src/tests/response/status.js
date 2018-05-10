'use strict'

// Retrieve test's expected response HTTP status code
const getResponseStatus = function({
  testOpts: { response: { status = DEFAULT_STATUS_CODE } = {} },
}) {
  return status
}

const DEFAULT_STATUS_CODE = 200

module.exports = {
  getResponseStatus,
}
