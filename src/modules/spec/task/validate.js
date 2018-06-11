'use strict'

const { getSpecResponse } = require('./operation')

// Add OpenAPI specification to `task.validate.*`
const addSpecToValidate = function({ spec, key, validate, validate: { byStatus } = {} }) {
  // Optional dependency
  if (validate === undefined) {
    return
  }

  const specResponses = getSpecResponse({ key, spec })

  // Task does not start with an `operationId`
  if (specResponses === undefined) {
    return validate
  }

  return { ...validate, byStatus: { ...byStatus, ...specResponses } }
}

module.exports = {
  addSpecToValidate,
}
