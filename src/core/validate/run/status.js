'use strict'

const { TestOpenApiError } = require('../../../errors')

// Validates response status code
const validateStatus = function({
  validate: { status: vStatus = DEFAULT_STATUS },
  response: { status },
}) {
  if (status === vStatus) {
    return
  }

  throw new TestOpenApiError(`Status code should not be ${status} but ${vStatus}`, {
    value: status,
    expected: vStatus,
    property: 'task.validate.status',
  })
}

const DEFAULT_STATUS = 200

module.exports = {
  validateStatus,
}
