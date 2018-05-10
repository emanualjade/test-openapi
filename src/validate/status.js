'use strict'

// Validates response status code against OpenAPI specification
const validateStatus = function({
  test: {
    response: { status },
  },
  resStatus,
}) {
  if (status === resStatus) {
    return
  }

  throw new Error(`Expected HTTP status code ${status} but received ${resStatus} instead`)
}

module.exports = {
  validateStatus,
}
