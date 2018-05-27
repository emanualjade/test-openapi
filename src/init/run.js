'use strict'

const { addErrorHandler, addGenErrorHandler, runTasksHandler } = require('../errors')
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
  normalizeReturnValue,
} = require('../plugins')

// Repeat each task `config.repeat` times, each time with different random parameters
// It will only show as a single `it()`
// Run all tasks in parallel for performance reason
// If a single one fails though, whole `it()` will stop and report that one failure
// TODO: we should cancel other tasks if any of them fails. At the moment, this is
// not possible because `node-fetch` does not support `AbortController`:
// a PR is ongoing to add support: https://github.com/bitinn/node-fetch/pull/437
const runTasks = async function({
  task,
  task: {
    config: { repeat },
  },
  tasks,
}) {
  const runningTasks = new Array(repeat).fill().map(() => runTask({ task, tasks }))
  await Promise.all(runningTasks)
}

const eRunTasks = addErrorHandler(runTasks, runTasksHandler)

// Run an `it()` task
const runTask = async function({ task, task: { originalTask }, tasks }) {
  const {
    task: { request, response },
  } = await eRunPlugins({ task, tasks })
  // `task` will be the initial value before any plugin transformation
  return { request, response, ...originalTask }
}

const runPlugins = function({ task, tasks }) {
  return reduceAsync(PLUGINS, eRunPlugin, { task, tasks }, mergePlugin)
}

const runPlugin = function({ task, tasks }, plugin) {
  // Pass `runTask` for recursive tasks
  const runTaskA = taskA => runTask({ task: taskA, tasks })

  return plugin(task, { tasks, runTask: runTaskA })
}

// We merge the return value of each plugin
const mergePlugin = function({ task, tasks }, taskA) {
  const taskB = { ...task, ...taskA }
  return { task: taskB, tasks }
}

// Add initial `task` to every thrown error
const eRunPlugins = addGenErrorHandler(runPlugins, ({ task }) => ({ task }))

// Add `rawRequest` and `rawResponse` (named `request` and `response`) to every
// thrown error, if available
const eRunPlugin = addGenErrorHandler(runPlugin, ({ rawRequest, rawResponse }) => ({
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
  normalizeReturnValue,
]

module.exports = {
  runTasks: eRunTasks,
  runTask,
}
