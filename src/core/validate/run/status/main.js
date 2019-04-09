import { TestOpenApiError } from '../../../../errors.js'

import { parseStatus } from './parse.js'
import { normalizeStatuses } from './normalize.js'

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
  throw new TestOpenApiError(
    `Status code was expected to be ${statusesStr}, but got ${status}`,
    { value: status, expected, property: PROPERTY },
  )
}

const DEFAULT_STATUS = '2xx'
const PROPERTY = 'task.validate.status'

module.exports = {
  validateStatus,
}
