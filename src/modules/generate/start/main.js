'use strict'

const { TestOpenApiError } = require('../../../errors')
const { validateIsSchema, normalizeShortcut, locationToKey } = require('../../../utils')

// Normalize and validate `task.call.*` JSON schemas
const normalizeGenerate = function({ tasks }) {
  const tasksA = tasks.map(normalizeTaskGenerate)
  return { tasks: tasksA }
}

const normalizeTaskGenerate = function({ call: { params, ...call }, ...task }) {
  // `task.call.*: non-object` is shortcut for `{ enum: [value] }`
  const paramsA = params.map(normalizeParamShortcut)

  validateJsonSchemas({ params: paramsA, task })

  return { ...task, call: { ...call, params: paramsA } }
}

const normalizeParamShortcut = function({ value, ...param }) {
  const valueA = normalizeShortcut(value)
  return { ...param, value: valueA }
}

// Validate request parameters and response headers are valid JSON schema v4
// Validate that task values are JSON schemas version 4
// We cannot use later versions because json-schema-faker does not support them
// Must be done after merged to specification, and `deps` have been resolved
const validateJsonSchemas = function({ params, task }) {
  params.forEach(({ name, location, value }) => validateJsonSchema({ task, name, location, value }))
}

const validateJsonSchema = function({ task: { taskKey }, name, location, value }) {
  const { error } = validateIsSchema({ value })
  if (error === undefined) {
    return
  }

  const key = locationToKey({ location, name })
  const property = `call.${key}`
  throw new TestOpenApiError(
    `In task '${taskKey}', '${property}' is not a valid JSON schema v4:${error}`,
    {
      property,
      taskKey,
    },
  )
}

module.exports = {
  normalizeGenerate,
}
