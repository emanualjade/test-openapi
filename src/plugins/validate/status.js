'use strict'

const { throwResponseError } = require('../../errors')

// Validates response status code against OpenAPI specification
const validateStatus = function({ validate: { status: vStatus }, response: { status } }) {
  if (vStatus === status) {
    return
  }

  const property = 'response.status'
  const message = `Status code ${status} should be ${vStatus} instead.`
  throwResponseError(message, { property, expected: vStatus, actual: status })
}

module.exports = {
  validateStatus,
}
