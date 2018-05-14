'use strict'

// Validates response status code against OpenAPI specification
const validateStatus = function({
  response: { status: testStatus },
  fetchResponse: { status: fetchStatus },
}) {
  if (testStatus === fetchStatus) {
    return fetchStatus
  }

  throw new Error(`Status code ${fetchStatus} should be ${testStatus} instead.`)
}

module.exports = {
  validateStatus,
}
