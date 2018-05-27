'use strict'

const { mergeEach } = require('./each')

// Normalize tasks to format easy to work with when tasks are running
const normalizeTasks = function({ tasks, server }) {
  const tasksA = mergeEach({ tasks })

  const tasksB = Object.entries(tasksA).map(([taskKey, task]) =>
    normalizeTask({ taskKey, task, server }),
  )
  return { tasks: tasksB }
}

const normalizeTask = function({ taskKey, task, task: originalTask, server }) {
  const taskA = normalizeParams({ task, server })
  return { ...taskA, originalTask, taskKey }
}

// From `task.parameters.*` object to an array of `{ name, location, required, schema }`
// Also rename `parameters` to `params`
const normalizeParams = function({ task: { parameters: params = {}, ...task }, server }) {
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

module.exports = {
  normalizeTasks,
}
