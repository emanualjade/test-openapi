'use strict'

const { TestOpenApiError } = require('../../../../errors')

const { parseStatus } = require('./parse')
const { normalizeStatuses } = require('./normalize')

// Validates response status code
const validateStatus = function({
  validate: { status: vStatus = DEFAULT_STATUS },
  response: { status },
}) {
  const vStatuses = parseStatus(vStatus)

  if (vStatuses.includes(String(status))) {
    return
  }

  const { value: expected, statusesStr } = normalizeStatuses(vStatuses)
  throw new TestOpenApiError(`Status code should not be ${status} but ${statusesStr}`, {
    value: status,
    expected,
    property: 'task.validate.status',
  })
}

const DEFAULT_STATUS = '2xx'

module.exports = {
  validateStatus,
}
