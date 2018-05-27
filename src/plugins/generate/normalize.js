'use strict'

const { mapValues } = require('lodash')

const { throwTaskError } = require('../../errors')
const { validateIsSchema, normalizeShortcut } = require('../../utils')

const normalizeTasksGenerate = function({ tasks }) {
  const tasksA = tasks.map(normalizeTaskGenerate)
  return { tasks: tasksA }
}

const normalizeTaskGenerate = function({ params, ...task }) {
  // `task.parameters.*: non-object` is shortcut for `{ enum: [value] }`
  const paramsA = mapValues(params, normalizeShortcut)

  validateJsonSchemas({ params: paramsA, task })

  return { ...task, params: paramsA }
}

// Validate request parameters and response headers are valid JSON schema v4
// Validate that task values are JSON schemas version 4
// We cannot use later versions because json-schema-faker does not support them
// Must be done after merged to specification, and `deps` have been resolved
const validateJsonSchemas = function({ params, task }) {
  Object.entries(params).forEach(([name, value]) => validateJsonSchema({ task, name, value }))
}

const validateJsonSchema = function({ task: { taskKey }, name, value }) {
  const { error } = validateIsSchema({ value })
  if (error === undefined) {
    return
  }

  const property = `parameters.${name}`
  throwTaskError(`In task '${taskKey}', '${property}' is not a valid JSON schema v4:${error}`, {
    property,
    task: taskKey,
  })
}

module.exports = {
  normalizeTasksGenerate,
}
