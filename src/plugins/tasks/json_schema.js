'use strict'

const { throwTaskError } = require('../../errors')
const { validateIsSchema } = require('../../utils')

// Validate request parameters and response headers are valid JSON schema v4
// Validate that task values are JSON schemas version 4
// We cannot use later versions because json-schema-faker does not support them
// Must be done after merged to specification, and `deps` have been resolved
const validateTasksJsonSchemas = function({ tasks }) {
  return tasks.forEach(validateTaskJsonSchemas)
}

const validateTaskJsonSchemas = function(task) {
  PROPERTIES.forEach(prop => validateJsonSchemas({ task, prop }))
}

const PROPERTIES = ['parameters']

const validateJsonSchemas = function({ task, prop }) {
  const obj = task[prop]
  if (obj === undefined) {
    return
  }

  Object.entries(obj).forEach(([name, value]) => validateJsonSchema({ task, prop, name, value }))
}

const validateJsonSchema = function({ task: { taskKey }, prop, name, value }) {
  const { error } = validateIsSchema({ value })
  if (error === undefined) {
    return
  }

  const property = `${prop}.${name}`
  throwTaskError(`In task '${taskKey}', '${property}' is not a valid JSON schema v4:${error}`, {
    property,
    task: taskKey,
  })
}

module.exports = {
  validateTasksJsonSchemas,
}
