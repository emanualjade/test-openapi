'use strict'

const { sortArray } = require('../../../utils')

// Add OpenAPI specification to `task.validate.*`
// Use the specification response matching both the current operation and
// the received status code `{ '200': validate, default: validate, ... }`
const addSpecToValidate = function({
  validate,
  validate: { byStatus } = {},
  pluginNames,
  operation: { responses },
}) {
  // Optional dependency
  if (!pluginNames.includes('validate')) {
    return
  }

  const status = getSpecStatus({ responses })

  return { status, ...validate, byStatus: { ...byStatus, ...responses } }
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

module.exports = {
  addSpecToValidate,
}
