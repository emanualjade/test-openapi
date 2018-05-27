'use strict'

const { throwTaskError } = require('../../errors')
const { validateIsSchema, normalizeShortcut } = require('../../utils')

const normalizeTasksGenerate = function({ tasks }) {
  const tasksA = tasks.map(normalizeTaskGenerate)
  return { tasks: tasksA }
}

const normalizeTaskGenerate = function({ params, ...task }) {
  // `task.parameters.*: non-object` is shortcut for `{ enum: [value] }`
  const paramsA = params.map(normalizeParamShortcut)

  validateJsonSchemas({ params: paramsA, task })

  return { ...task, params: paramsA }
}

const normalizeParamShortcut = function({ schema, ...param }) {
  const schemaA = normalizeShortcut(schema)
  return { ...param, schema: schemaA }
}

// Validate request parameters and response headers are valid JSON schema v4
// Validate that task values are JSON schemas version 4
// We cannot use later versions because json-schema-faker does not support them
// Must be done after merged to specification, and `deps` have been resolved
const validateJsonSchemas = function({ params, task }) {
  params.forEach(({ name, schema }) => validateJsonSchema({ task, name, schema }))
}

const validateJsonSchema = function({ task: { taskKey }, name, schema }) {
  const { error } = validateIsSchema({ value: schema })
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
