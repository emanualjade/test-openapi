'use strict'

const { throwTaskError } = require('../../../errors')
const { validateIsSchema } = require('../../../utils')

// Validate request parameters and response headers are valid JSON schema v4
// Validate that task values are JSON schemas version 4
// We cannot use later versions because json-schema-faker does not support them
// Must be done after merged to specification, and `deps` have been resolved
const validateParamsJsonSchemas = function({ tasks }) {
  return tasks.forEach(validateJsonSchemas)
}

const validateJsonSchemas = function({ params, ...task }) {
  Object.entries(params).forEach(([name, value]) => validateJsonSchema({ task, name, value }))
}

const validateJsonSchema = function({ task: { taskKey }, name, value }) {
  const { error } = validateIsSchema({ value })
  if (error === undefined) {
    return
  }

  const property = `params.${name}`
  throwTaskError(`In task '${taskKey}', '${property}' is not a valid JSON schema v4:${error}`, {
    property,
    task: taskKey,
  })
}

module.exports = {
  validateParamsJsonSchemas,
}
