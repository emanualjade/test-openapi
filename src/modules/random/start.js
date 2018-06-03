'use strict'

const { TestOpenApiError } = require('../../errors')
const { validateIsSchema, keyToLocation, mergeParams } = require('../../utils')

// Validate and add `task.random.*` to `task.call.params`
const addRandomParams = function({ tasks }) {
  const tasksA = tasks.map(addTaskRandomParams)
  return { tasks: tasksA }
}

const addTaskRandomParams = function({ call: { params, ...call }, random, ...task }) {
  const randomA = Object.entries(random).map(([key, value]) =>
    normalizeRandomParam({ key, value, task }),
  )

  const paramsA = mergeParams([...params, ...randomA])
  return { ...task, call: { ...call, params: paramsA } }
}

// From `task.random.*` object to an array of `{ name, location, required, value, isRandom: true }`
const normalizeRandomParam = function({ key, value, task }) {
  validateJsonSchema({ key, value, task })

  const { location, name } = keyToLocation({ key })

  // Parameters specified in `task.random.*` are always required (i.e. generated)
  return { location, name, value, required: true, isRandom: true }
}

// Validate random parameters are valid JSON schema v4
// We cannot use later versions because json-schema-faker does not support them
const validateJsonSchema = function({ key, value, task: { taskKey } }) {
  const { error } = validateIsSchema({ value })
  if (error === undefined) {
    return
  }

  const property = `random.${key}`
  throw new TestOpenApiError(
    `In task '${taskKey}', '${property}' is not a valid JSON schema v4:${error}`,
    {
      property,
      taskKey,
    },
  )
}

module.exports = {
  addRandomParams,
}
