'use strict'

const { mapKeys, difference } = require('lodash')
const { STATUS_CODES } = require('statuses')

const { sortArray } = require('../../../utils')
const { replaceByRanges } = require('../../validate/run/status')

// Add OpenAPI specification to `task.validate.*`
// Use the specification response matching both the current operation and
// the received status code `{ '200': validate, default: validate, ... }`
const addSpecToValidate = function({ validate, pluginNames, operation: { responses } }) {
  // Optional dependency
  if (!pluginNames.includes('validate')) {
    return
  }

  const status = getSpecStatus({ responses })

  const responsesA = mapKeys(responses, (value, status) =>
    handleDefaultResponse({ status, responses }),
  )

  return { status, ...validate, ...responsesA }
}

// If there is a 2** response, the lowest one is used as default `validate.status`
const getSpecStatus = function({ responses }) {
  const statuses = Object.keys(responses)
  const statusesA = sortArray(statuses)
  const statusA = statusesA.find(isSuccessStatus)
  if (statusA === undefined) {
    return
  }

  return Number(statusA)
}

const isSuccessStatus = function(status) {
  return status.startsWith('2')
}

// If there is a `default` response, it becomes `validate.STATUSES` where
// `STATUSES` are all the other valid HTTP statuses.
const handleDefaultResponse = function({ status, responses }) {
  if (status !== 'default') {
    return status
  }

  const responseStatuses = Object.keys(responses)
  const validStatuses = Object.keys(STATUS_CODES)
  const statuses = difference(validStatuses, responseStatuses)

  const statusesA = replaceByRanges({ statuses })

  const statusesB = sortArray(statusesA)
  const key = statusesB.join(' ')
  return key
}

module.exports = {
  addSpecToValidate,
}
