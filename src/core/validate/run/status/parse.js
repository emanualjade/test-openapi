'use strict'

const { difference, uniq } = require('lodash')

const { TestOpenApiError } = require('../../../../errors')
const { sortArray } = require('../../../../utils')

const { parseRanges, replaceByRanges } = require('./range')
const { VALID_STATUSES } = require('./valid')
const { normalizeStatuses } = require('./normalize')

// Parse `validate.status` into an array of possible statuses
const parseStatus = function({ status, property }) {
  // `validate.status` can be an integer because it's simpler when writing in
  // YAML (does not require quotes)
  const statusA = String(status)

  // `validate.status` can a space-delimited list of statuses
  const statuses = statusA.split(/\s+/u)

  const statusesA = uniq(statuses)

  const statusesB = parseRanges({ statuses: statusesA })

  checkValidStatuses({ statuses: statusesB, property })

  return statusesB
}

const checkValidStatuses = function({ statuses, property }) {
  const invalidStatuses = difference(statuses, VALID_STATUSES)

  if (invalidStatuses.length === 0) {
    return
  }

  const { value, statusesStr } = normalizeStatuses(invalidStatuses)
  const expected = VALID_STATUSES.map(Number)
  throw new TestOpenApiError(
    `The task definition is invalid: those are not valid HTTP status codes: ${statusesStr}`,
    { value, expected, property },
  )
}

// Inverse of `parseStatus`
const serializeStatus = function({ statuses }) {
  const statusesA = replaceByRanges({ statuses })
  const statusesB = sortArray(statusesA)
  const statusKey = statusesB.join(' ')
  return statusKey
}

// Status code like `102` or status range like `2xx`
const STATUS_REGEXP = /^[1-5][\dx]{2}/iu

module.exports = {
  parseStatus,
  serializeStatus,
  STATUS_REGEXP,
}
