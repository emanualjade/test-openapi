'use strict'

const { STATUS_CODES } = require('statuses')
const { difference, uniq, groupBy } = require('lodash')

const { TestOpenApiError } = require('../../../errors')
const { getWordsList, sortArray } = require('../../../utils')

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

// Parse `validate.status` into an array of possible statuses
const parseStatus = function(status) {
  // `validate.status` can be an integer because it's simpler when writing in YAML
  // (does not require quotes)
  const statusA = String(status)

  // `validate.status` can a space-delimited list of statuses
  const statuses = statusA.split(/\s+/)

  const statusesA = statuses.map(parseRange)
  const statusesB = [].concat(...statusesA)

  const statusesC = uniq(statusesB)

  const statusesD = sortArray(statusesC)

  checkValidStatuses({ statuses: statusesD })

  return statusesD
}

// `validate.status` can be `1xx`, `2xx`, `3xx`, `4xx` or `5xx`, case-insensitively
const parseRange = function(status) {
  if (!RANGE_REGEXP.test(status)) {
    return status
  }

  const statuses = VALID_STATUSES_MAP[status.toLowerCase()]
  return statuses
}

const RANGE_REGEXP = /^[1-5]xx$/i

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

// Normalize status for error reporting
const normalizeStatuses = function(statuses) {
  const statusesA = replaceByRanges({ statuses })

  const statusesB = sortArray(statusesA)

  const statusesC = statusesB.map(numerizeStatus)

  if (statusesC.length === 1) {
    return { value: statusesC[0], statusesStr: String(statusesC[0]) }
  }

  const statusesStr = getWordsList(statusesC)
  return { value: statusesC, statusesStr }
}

// Replace `100` + `101` + `102` by `1xx`, for any status code range
const replaceByRanges = function({ statuses }) {
  return Object.entries(VALID_STATUSES_MAP).reduce(replaceByRange, statuses)
}

const replaceByRange = function(statuses, [range, rangeStatuses]) {
  const statusesA = difference(statuses, rangeStatuses)
  // Only if all possible status codes for that range are here
  if (statuses.length - statusesA.length !== rangeStatuses.length) {
    return statuses
  }

  return [range, ...statusesA]
}

// Try to error report statuses as integers
const numerizeStatus = function(status) {
  const statusA = Number(status)

  if (!Number.isInteger(statusA)) {
    return status
  }

  return statusA
}

// All possible HTTP status code as an array and as a
// `{ "1xx": [...], "2xx": [...], ... }` map
const getValidStatusesMap = function() {
  const validStatuses = Object.keys(STATUS_CODES)
  const validStatusesMap = groupBy(validStatuses, status => `${status[0]}xx`)
  return { validStatuses, validStatusesMap }
}

const {
  validStatuses: VALID_STATUSES,
  validStatusesMap: VALID_STATUSES_MAP,
} = getValidStatusesMap()

module.exports = {
  validateStatus,
}
