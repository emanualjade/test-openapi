'use strict'

const { pick } = require('lodash')

const { addGenErrorHandler } = require('../errors')
const { reduceAsync } = require('../utils')
const { deps, spec, generate, format, url, request, validate } = require('../plugins')

// Run an `it()` task
const runTask = async function({ originalTask, ...task }, context) {
  const contextA = addRunTask({ context })

  const { task: taskA } = await eRunPlugins({ task, context: contextA })

  const taskB = getTaskReturn({ task: taskA, originalTask })
  return taskB
}

// Pass `runTask` for recursive tasks
// If some plugins (like the `repeat` plugin) monkey patch `runTask()`, the
// non-monkey patched version is passed instead
const addRunTask = function({ context }) {
  const runTaskA = task => runTask(task, context)
  return { ...context, runTask: runTaskA }
}

const runPlugins = function({ task, context }) {
  return reduceAsync(PLUGINS, eRunPlugin, { task, context }, mergePlugin)
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
  const taskA = pick(task, request.returnedProperties)

  // Any value set on `task.*` by a plugin is returned, unless it already existed
  // in original task
  return { ...taskA, ...originalTask }
}

// Add initial `task` to every thrown error
const eRunPlugins = addGenErrorHandler(runPlugins, ({ task: { taskKey } }) => ({ task: taskKey }))

// Add `rawRequest` and `rawResponse` (named `request` and `response`) to every
// thrown error, if available
const eRunPlugin = addGenErrorHandler(runPlugin, ({ task: { rawRequest, rawResponse } }) => ({
  request: rawRequest,
  response: rawResponse,
}))

const PLUGINS = [
  deps.task,
  spec.task[0],
  generate.task,
  format.task[0],
  url.task,
  request.task[0],
  format.task[1],
  spec.task[1],
  validate.task,
  request.task[1],
]

module.exports = {
  runTask,
}
