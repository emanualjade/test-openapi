'use strict'

const { addErrorHandler } = require('../errors')
const { runHandlers, getTaskReturn } = require('../plugins')

// Run `task` handlers
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
  const { task: taskA, error } = await mRunTask(task, { plugins, readOnlyArgs, isNested: true })

  // Propagate to parent
  if (error) {
    throw error
  }

  // Returns `task` not `{ task }`
  return taskA
}

const runTask = async function({ originalTask, ...task }, { plugins, readOnlyArgs }) {
  const taskA = await runHandlers(task, plugins, 'task', readOnlyArgs, runPluginHandler)

  const taskB = getTaskReturn({ task: taskA, originalTask, plugins })
  return { task: taskB }
}

// Let calling code handle errored tasks.
// I.e. on exception, successfully return `{ task, error }` instead of throwing it.
const runTaskHandler = function(error, { originalTask }, { plugins }) {
  const task = getTaskReturn({ task: error.task, originalTask, plugins })
  Object.assign(error, { task })
  return { task, error }
}

const eRunTask = addErrorHandler(runTask, runTaskHandler)

// Error handler for each plugin handler
const runPluginHandler = function(error, task) {
  Object.assign(error, { task })
  throw error
}

module.exports = {
  bootTask,
  runTask: eRunTask,
}
