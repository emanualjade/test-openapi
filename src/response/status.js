'use strict'

const { throwResponseError } = require('../errors')

// Validates response status code against OpenAPI specification
const validateStatus = function({
  response: { status: testStatus },
  fetchResponse: { status: fetchStatus },
}) {
  if (testStatus === fetchStatus) {
    return fetchStatus
  }

  const message = `Status code ${fetchStatus} should be ${testStatus} instead.`
  throwResponseError(message)
}

module.exports = {
  validateStatus,
}
