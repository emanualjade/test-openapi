'use strict'

const { pick } = require('lodash')

const { addGenErrorHandler } = require('../errors')
const { reduceAsync } = require('../utils')

// Run an `it()` task
const runTask = async function({ originalTask, ...task }, context, plugins) {
  const contextA = addRunTask({ context, plugins })

  const { task: taskA } = await runTaskPlugins({ task, context: contextA, plugins })

  const taskB = getTaskReturn({ task: taskA, originalTask })
  return taskB
}

// Pass `runTask` for recursive tasks
// If some plugins (like the `repeat` plugin) monkey patch `runTask()`, the
// non-monkey patched version is passed instead
const addRunTask = function({ context, plugins }) {
  const runTaskA = task => runTask(task, context, plugins)
  return { ...context, runTask: runTaskA }
}

const runTaskPlugins = function({
  task,
  context,
  plugins: {
    handlers: { task: taskHandlers },
  },
}) {
  return reduceAsync(taskHandlers, eRunPlugin, { task, context }, mergePlugin)
}

const runPlugin = function({ task, context }, plugin) {
  return plugin(task, context)
}

// We merge the return value of each plugin
const mergePlugin = function({ task, context }, taskA) {
  return { task: { ...task, ...taskA }, context }
}

// Task return value, returned to users and used by depReqs
const getTaskReturn = function({ task, originalTask }) {
  // TODO: use `returnedProperties` instead
  const taskA = pick(task, ['request', 'response'])

  // Any value set on `task.*` by a plugin is returned, unless it already existed
  // in original task
  return { ...taskA, ...originalTask }
}

// Add `rawRequest` and `rawResponse` (named `request` and `response`) to every
// thrown error, if available
const eRunPlugin = addGenErrorHandler(runPlugin, ({ task: { rawRequest, rawResponse } }) => ({
  request: rawRequest,
  response: rawResponse,
}))

module.exports = {
  runTask,
}
