'use strict'

const { mapValues } = require('lodash')

const { isObject } = require('../utils')
const { addErrorHandler } = require('../errors')
const { runHandlers, addTaskErrorProp } = require('../plugins')

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

  // Returns `taskA` not `{ task: taskA }`
  return taskA
}

const runTask = async function({ originalTask, ...task }, { plugins, readOnlyArgs }) {
  const taskA = await runHandlers(
    task,
    plugins,
    'task',
    readOnlyArgs,
    runPluginHandler.bind(null, { plugins, originalTask }),
  )

  const taskB = mergeOriginalTask({ task: taskA, originalTask })
  return { task: taskB }
}

// Let calling code handle errored tasks.
// I.e. on exception, successfully return `{ error }` instead of throwing it.
const runTaskHandler = function(error) {
  return { error }
}

const eRunTask = addErrorHandler(runTask, runTaskHandler)

// Error handler for each plugin handler
const runPluginHandler = function({ plugins, originalTask }, error, task) {
  const taskA = mergeOriginalTask({ task, originalTask })
  const errorA = addTaskErrorProp({ error, task: taskA, plugins })
  throw errorA
}

// Task return value, returned to users and used by depReqs
const mergeOriginalTask = function({ task, originalTask }) {
  return mapValues(task, (newTask, prop) => shallowMerge(newTask, originalTask[prop]))
}

// Do a shallow merge on each plugin value
// The originalTask properties has more priority
const shallowMerge = function(newTask, originalTask) {
  if (originalTask === undefined) {
    return newTask
  }

  if (!isObject(newTask) || !isObject(originalTask)) {
    return originalTask
  }

  return { ...newTask, ...originalTask }
}

module.exports = {
  bootTask,
  runTask: eRunTask,
}
