'use strict'

const { TestOpenApiError } = require('../../../../errors')

const { parseStatus } = require('./parse')
const { normalizeStatuses } = require('./normalize')

// Validates response status code
const validateStatus = function({
  validate: { status: vStatus = DEFAULT_STATUS },
  response: { status },
}) {
  const vStatuses = parseStatus({ status: vStatus, property: PROPERTY })

  if (vStatuses.includes(String(status))) {
    return
  }

  const { value: expected, statusesStr } = normalizeStatuses(vStatuses)
  throw new TestOpenApiError(`Status code should not be ${status} but ${statusesStr}`, {
    value: status,
    expected,
    property: PROPERTY,
  })
}

const DEFAULT_STATUS = '2xx'
const PROPERTY = 'task.validate.status'

module.exports = {
  validateStatus,
}
