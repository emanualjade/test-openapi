'use strict'

const { getSpecResponse } = require('./operation')

// Add OpenAPI specification to `task.validate.*`
const addSpecToValidate = function({
  spec,
  task,
  task: { key, validate, validate: { schemasByStatus } = {} },
  pluginNames,
}) {
  // Optional dependency
  if (!pluginNames.includes('validate')) {
    return task
  }

  const specResponses = getSpecResponse({ key, spec })

  // Task does not start with an `operationId`
  if (specResponses === undefined) {
    return task
  }

  const schemasByStatusA = { ...schemasByStatus, ...specResponses }
  return { ...task, validate: { ...validate, schemasByStatus: schemasByStatusA } }
}

module.exports = {
  addSpecToValidate,
}
