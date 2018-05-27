'use strict'

const { keyToLocation } = require('../../utils')

// From `task.parameters.*` object to an array of `{ name, location, required, schema }`
// Also rename `parameters` to `params`, and apply `config.server`
const normalizeTasksParams = function({ tasks, server }) {
  const tasksA = tasks.map(task => normalizeParams({ task, server }))
  return { tasks: tasksA }
}

const normalizeParams = function({ task: { parameters: params = {}, ...task }, server }) {
  const paramsA = addServer({ params, server })
  const paramsB = Object.entries(paramsA).map(normalizeParam)
  return { ...task, params: paramsB }
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
const normalizeParam = function([key, schema]) {
  const { location, name } = keyToLocation({ key })

  // Parameters specified in `task.parameters.*` are always required (i.e. generated)
  return { location, name, schema, required: true }
}

module.exports = {
  normalizeTasksParams,
}
