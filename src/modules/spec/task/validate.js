'use strict'

const { hasOptionalDependency } = require('../../../utils')

const { getSpecResponse } = require('./operation')

// Add OpenAPI specification to `task.validate.*`
const addSpecToValidate = function({ spec, key, validate, validate: { byStatus } = {}, plugins }) {
  if (!hasOptionalDependency({ plugins, name: 'validate' })) {
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
