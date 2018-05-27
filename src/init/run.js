'use strict'

const { pick } = require('lodash')

const { addGenErrorHandler } = require('../errors')
const { reduceAsync } = require('../utils')
const {
  replaceDeps,
  mergeSpecParams,
  generateParams,
  stringifyParams,
  addFullUrl,
  sendRequest,
  parseResponse,
  mergeSpecValidate,
  validateResponse,
  getReturnValue,
  returnedProperties,
} = require('../plugins')

// Repeat each task `config.repeat` times, each time with different random parameters
// It will only show as a single `it()`
// Run all tasks in parallel for performance reason
// If a single one fails though, whole `it()` will stop and report that one failure
// TODO: we should cancel other tasks if any of them fails. At the moment, this is
// not possible because `node-fetch` does not support `AbortController`:
// a PR is ongoing to add support: https://github.com/bitinn/node-fetch/pull/437
const runTask = async function(task, context) {
  const {
    config: { repeat },
  } = context
  const runningTasks = new Array(repeat).fill().map(() => realRunTask(task, context))
  await Promise.all(runningTasks)
}

// Run an `it()` task
const realRunTask = async function({ originalTask, ...task }, context) {
  const contextA = addRunTask({ context })

  const { task: taskA } = await eRunPlugins({ task, context: contextA })

  const taskB = getTaskReturn({ task: taskA, originalTask })
  return taskB
}

// Pass `runTask` for recursive tasks
// If some plugins (like the `repeat` plugin) monkey patch `runTask()`, the
// non-monkey patched version is passed instead
const addRunTask = function({ context }) {
  const runTaskA = task => realRunTask(task, context)
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
  const taskA = pick(task, returnedProperties)

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
  // Replace all `deps`, i.e. references to other tasks.
  replaceDeps,
  // Merge `task.parameters.*` to specification
  mergeSpecParams,
  // Generates random request parameters based on JSON schema
  generateParams,
  // Stringify request parameters
  stringifyParams,
  // Retrieve full URL from request parameters
  addFullUrl,
  // Send an HTTP request to the endpoint
  sendRequest,
  // Parse response
  parseResponse,
  // Merge `task.validate.*` to specification
  mergeSpecValidate,
  // Validates the HTTP response
  validateResponse,
  // Returns final normalized value
  getReturnValue,
]

module.exports = {
  runTask,
}
