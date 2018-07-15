'use strict'

const { sortArray } = require('../../../utils')

const { getSpecResponse } = require('./operation')

// Add OpenAPI specification to `task.validate.*`
const addSpecToValidate = function({
  spec,
  key,
  validate,
  validate: { byStatus } = {},
  pluginNames,
}) {
  // Optional dependency
  if (!pluginNames.includes('validate')) {
    return
  }

  const specResponses = getSpecResponse({ key, spec })

  // Task does not start with an `operationId`
  if (specResponses === undefined) {
    return validate
  }

  const status = getSpecStatus({ specResponses })

  return { status, ...validate, byStatus: { ...byStatus, ...specResponses } }
}

// If there is a 2** response, the lowest one is used as default `validate.status`
const getSpecStatus = function({ specResponses }) {
  const statuses = Object.keys(specResponses)
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
