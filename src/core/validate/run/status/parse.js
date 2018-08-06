'use strict'

const { difference, uniq } = require('lodash')

const { TestOpenApiError } = require('../../../../errors')

const { parseRanges } = require('./range')
const { VALID_STATUSES } = require('./valid')
const { normalizeStatuses } = require('./normalize')

// Parse `validate.status` into an array of possible statuses
const parseStatus = function(status) {
  // `validate.status` can be an integer because it's simpler when writing in YAML
  // (does not require quotes)
  const statusA = String(status)

  // `validate.status` can a space-delimited list of statuses
  const statuses = statusA.split(/\s+/)

  const statusesA = uniq(statuses)

  const statusesB = parseRanges({ statuses: statusesA })

  checkValidStatuses({ statuses: statusesB })

  return statusesB
}

const checkValidStatuses = function({ statuses }) {
  const invalidStatuses = difference(statuses, VALID_STATUSES)
  if (invalidStatuses.length === 0) {
    return
  }

  const { value, statusesStr } = normalizeStatuses(invalidStatuses)
  const expected = VALID_STATUSES.map(Number)
  throw new TestOpenApiError(
    `The task definition is invalid: those are not valid HTTP status codes: ${statusesStr}`,
    { value, expected, property: 'task.validate.status' },
  )
}

module.exports = {
  parseStatus,
}
