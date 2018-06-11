'use strict'

const { addErrorHandler } = require('../errors')
const { runHandlers, getTaskReturn } = require('../plugins')

// Run each `plugin.task()`
const bootTask = async function({ task, config, mRunTask, plugins }) {
  const readOnlyArgs = getTaskReadOnlyArgs({ config, mRunTask, plugins })

  // Use potentially monkey-patched `runTask`
  const returnValue = await mRunTask(task, { readOnlyArgs, plugins })
  return returnValue
}

// Passed to every task handler
const getTaskReadOnlyArgs = function({ config, mRunTask, plugins }) {
  // Those arguments are passed to each task, but cannot be modified
  const readOnlyArgs = { config }

  // Must directly mutate to handle recursion
  readOnlyArgs.runTask = runRecursiveTask.bind(null, { mRunTask, plugins, readOnlyArgs })

  return readOnlyArgs
}

// Pass `runTask` for recursive tasks, with the second argument bound
// Also tasks can use `isNested` to know if this is a recursive call
const runRecursiveTask = async function({ mRunTask, plugins, readOnlyArgs }, task) {
  const { task: taskA, error } = await mRunTask(task, {
    plugins,
    readOnlyArgs: { ...readOnlyArgs, isNested: true },
  })

  // Propagate to parent
  if (error) {
    throw error
  }

  // Returns `task` not `{ task }`
  return taskA
}

const runTask = async function({ originalTask, ...task }, { plugins, readOnlyArgs }) {
  const taskA = await runHandlers(task, plugins, 'task', readOnlyArgs, runPluginHandler)

  // Normalize `task` by calling all `plugin.returnValue`
  const taskB = getTaskReturn({ task: taskA, originalTask, plugins })
  return { task: taskB }
}

// Let calling code handle errored tasks.
// I.e. on exception, successfully return `{ task, error }` instead of throwing it.
const runTaskHandler = function(error, { originalTask }, { plugins }) {
  const { task, aborted } = error

  // Normalize `task` by calling all `plugin.returnValue`
  const taskA = getTaskReturn({ task, originalTask, plugins, aborted })

  // When throwing an Error with `error.aborted: true`, this means the task was
  // stopped but should be considered a success
  if (aborted) {
    return { task: taskA }
  }

  Object.assign(error, { task: taskA })
  return { task: taskA, error }
}

const eRunTask = addErrorHandler(runTask, runTaskHandler)

// Error handler for each plugin handler
// Persist current `task` values by setting it to thrown error
const runPluginHandler = function(error, task) {
  Object.assign(error, { task })
  throw error
}

module.exports = {
  bootTask,
  runTask: eRunTask,
}
