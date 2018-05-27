'use strict'

const { keyToLocation } = require('../../utils')

// From `task.parameters.*` object to an array of `{ name, location, required, schema }`
// Also rename `parameters` to `params`, and apply `config.server`
const normalizeTasksParamsBefore = function({ tasks, server }) {
  return tasks.map(task => normalizeParamsBefore({ task, server }))
}

const normalizeParamsBefore = function({ task: { parameters: params = {}, ...task }, server }) {
  const paramsA = addServer({ params, server })
  return { ...task, params: paramsA }
}

// `config.server` is added as `task.parameters.server` for each task, unless
// it already exists
const addServer = function({ params, server }) {
  if (server === undefined) {
    return params
  }

  return { server, ...params }
}

// From `task.parameters.*` object to an array of `{ name, location, required, schema }`
const normalizeTasksParams = function({ tasks }) {
  const tasksA = tasks.map(normalizeParams)
  return { tasks: tasksA }
}

const normalizeParams = function({ params, ...task }) {
  const paramsA = Object.entries(params).map(normalizeParam)
  return { ...task, params: paramsA }
}

const normalizeParam = function([key, schema]) {
  const { location, name } = keyToLocation({ key })

  // Parameters specified in `task.parameters.*` are always required (i.e. generated)
  return { schema, required: true, location, name }
}

module.exports = {
  normalizeTasksParamsBefore,
  normalizeTasksParams,
}
