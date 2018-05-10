'use strict'

// Retrieve test's expected response HTTP status code
const getSpecResStatus = function({ settings: { responseStatus = DEFAULT_STATUS_CODE } }) {
  return responseStatus
}

const DEFAULT_STATUS_CODE = 200

module.exports = {
  getSpecResStatus,
}
