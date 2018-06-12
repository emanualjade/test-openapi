'use strict'

const { addErrorHandler } = require('../errors')
const { runHandlers, getTaskReturn } = require('../plugins')

// Run each `plugin.task()`
const bootTask = async function({ task, config, mRunTask, plugins }) {
  const readOnlyArgs = getTaskReadOnlyArgs({ config, mRunTask, plugins })

  // Use potentially monkey-patched `runTask`
  const taskA = await mRunTask(task, { readOnlyArgs, plugins })
  return taskA
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
  const readOnlyArgsA = { ...readOnlyArgs, isNested: true }
  const taskA = await mRunTask(task, { plugins, readOnlyArgs: readOnlyArgsA })

  // Propagate to parent
  const { error } = taskA
  if (error !== undefined) {
    throw error
  }

  return taskA
}

const runTask = async function({ originalTask, ...task }, { plugins, readOnlyArgs }) {
  const taskA = await runHandlers(task, plugins, 'task', readOnlyArgs, runPluginHandler)

  const taskB = getTaskReturn({ task: taskA, originalTask, plugins })
  return taskB
}

// Let calling code handle errored tasks.
// I.e. on exception, successfully return `{ task, error }` instead of throwing it.
const runTaskHandler = function(error, { originalTask }, { plugins }) {
  const { task, aborted } = extractErrorProps({ error })

  const taskA = getTaskReturn({ task, originalTask, plugins, aborted, error })
  return taskA
}

// We only assign those properties to `error` to carry information during throw.
// But we don't want to persist those
const extractErrorProps = function({ error, error: { task, aborted } }) {
  delete error.task
  delete error.aborted
  return { task, aborted }
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
