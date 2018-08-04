'use strict'

const { STATUS_CODES } = require('statuses')
const { difference, uniq } = require('lodash')

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

  const vStatusesStr = getWordsList(vStatuses)
  const expected = normalizeStatuses(vStatuses)
  throw new TestOpenApiError(`Status code should not be ${status} but ${vStatusesStr}`, {
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

const checkValidStatuses = function({ statuses }) {
  const invalidStatuses = difference(statuses, VALID_STATUSES)
  if (invalidStatuses.length === 0) {
    return
  }

  const invalidStatusesStr = getWordsList(invalidStatuses, { op: 'and' })
  const value = normalizeStatuses(invalidStatuses)
  const expected = VALID_STATUSES.map(Number)
  throw new TestOpenApiError(
    `The task definition is invalid: those are not valid HTTP status codes: ${invalidStatusesStr}`,
    { value, expected, property: 'task.validate.status' },
  )
}

// `validate.status` can be `1xx`, `2xx`, `3xx`, `4xx` or `5xx`, case-insensitively
const parseRange = function(status) {
  if (!RANGE_REGEXP.test(status)) {
    return status
  }

  const firstNum = status[0]
  const statuses = VALID_STATUSES.filter(validStatus => validStatus.startsWith(firstNum))
  return statuses
}

const RANGE_REGEXP = /^[1-5]xx$/i
const VALID_STATUSES = Object.keys(STATUS_CODES)

// Normalize status for error reporting
const normalizeStatuses = function(statuses) {
  if (statuses.length === 1) {
    return numerizeStatus(statuses[0])
  }

  return statuses.map(numerizeStatus)
}

// Try to error report statuses as integers
const numerizeStatus = function(status) {
  const statusA = Number(status)

  if (!Number.isInteger(statusA)) {
    return status
  }

  return statusA
}

module.exports = {
  validateStatus,
}
