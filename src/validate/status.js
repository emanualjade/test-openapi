'use strict'

// Validates response status code against OpenAPI specification
const validateResStatus = function({ test: { specResStatus }, resStatus }) {
  if (specResStatus === String(resStatus)) {
    return
  }

  throw new Error(`Expected HTTP status code ${specResStatus} but received ${resStatus} instead`)
}

module.exports = {
  validateResStatus,
}
