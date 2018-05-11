'use strict'

// Validates response status code against OpenAPI specification
const validateStatus = function({
  test: {
    response: { status },
  },
  resStatus,
}) {
  if (status === resStatus) {
    return status
  }

  throw new Error(`Invalid HTTP response status code ${resStatus}: it should be ${status}`)
}

module.exports = {
  validateStatus,
}
