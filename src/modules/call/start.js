'use strict'

const { keyToLocation } = require('../../utils')

// Set `task.call.params`, a normalized version of `task.call.*` object as an array
// of `{ name, location, value }`
// Also apply `config.call.server`
const normalizeParams = function({ tasks, call: { server } }) {
  const tasksA = tasks.map(task => normalizeTaskParams({ task, server }))
  return { tasks: tasksA }
}

const normalizeTaskParams = function({ task: { call, ...task }, server }) {
  const callA = addServer({ call, server })
  const params = Object.entries(callA).map(normalizeParam)
  return { ...task, call: { ...call, params } }
}

// `config.call.server` is added as `task.call.server` for each task, unless
// it already exists
const addServer = function({ call, server }) {
  if (server === undefined) {
    return call
  }

  return { server, ...call }
}

// From `task.call.*` object to an array of `{ name, location, value }`
const normalizeParam = function([key, value]) {
  const { location, name } = keyToLocation({ key })

  return { location, name, value }
}

module.exports = {
  normalizeParams,
}
