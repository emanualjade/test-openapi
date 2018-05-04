'use strict'

// Retrieve test's expected response HTTP status code
const getSpecResStatus = function({ statusCode }) {
  if (statusCode === 'default') {
    return DEFAULT_STATUS_CODE
  }

  return statusCode
}

const DEFAULT_STATUS_CODE = '200'

module.exports = {
  getSpecResStatus,
}
