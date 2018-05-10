'use strict'

// Retrieve test's expected response HTTP status code
const getSpecResStatus = function({
  testOpts: { response: { status = DEFAULT_STATUS_CODE } = {} },
}) {
  return status
}

const DEFAULT_STATUS_CODE = 200

module.exports = {
  getSpecResStatus,
}
