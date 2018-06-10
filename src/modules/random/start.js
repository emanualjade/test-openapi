'use strict'

const { TestOpenApiError } = require('../../errors')
const { validateIsSchema, keyToLocation } = require('../../utils')

// Validate and add `task.random.*` to `task.call.*`
const addRandomParams = function({ tasks }) {
  const tasksA = tasks.map(addTaskRandomParams)
  return { tasks: tasksA }
}

const addTaskRandomParams = function({ call: { params, ...call }, random, ...task }) {
  const randomA = Object.entries(random).map(([key, value]) => normalizeRandomParam({ key, value }))

  // `task.random.*` have less priority than `task.call.*`
  const paramsA = [...randomA, ...params]

  return { ...task, call: { ...call, params: paramsA } }
}

// From `task.random.*` object to an array of `{ name, location, value, random: 'deep' }`
const normalizeRandomParam = function({ key, value }) {
  validateJsonSchema({ key, value })

  const { location, name } = keyToLocation({ key })

  return { location, name, value, random: 'deep' }
}

// Validate random parameters are valid JSON schema v4
// We cannot use later versions because json-schema-faker does not support them
const validateJsonSchema = function({ key, value }) {
  const { error } = validateIsSchema({ value })
  if (error === undefined) {
    return
  }

  const property = `random.${key}`
  throw new TestOpenApiError(`'${property}' is not a valid JSON schema v4:${error}`, {
    property,
  })
}

module.exports = {
  addRandomParams,
}
