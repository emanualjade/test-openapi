'use strict'

// Validates response status code against OpenAPI specification
const validateStatus = function({
  test: {
    response: { status: testStatus },
  },
  fetchResponse: { status: fetchStatus },
}) {
  if (testStatus === fetchStatus) {
    return fetchStatus
  }

  throw new Error(`Invalid HTTP response status code ${fetchStatus}: it should be ${testStatus}`)
}

module.exports = {
  validateStatus,
}
