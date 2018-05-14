'use strict'

// Validates response status code against OpenAPI specification
const validateStatus = function({
  response: { status: testStatus },
  fetchResponse: { status: fetchStatus },
}) {
  if (testStatus === fetchStatus) {
    return fetchStatus
  }

  throw new Error(`Invalid status code ${fetchStatus}: it should be ${testStatus} instead.`)
}

module.exports = {
  validateStatus,
}
