'use strict'

const { mapValues } = require('lodash')

const { isObject } = require('../utils')
const { addErrorHandler } = require('../errors')
const { runHandlers } = require('../plugins')

// Run `task` handlers
const runTask = async function({ originalTask, ...task }, { plugins, readOnlyArgs }) {
  const taskA = await runHandlers(task, plugins, 'task', readOnlyArgs, runPluginHandler)

  const taskB = mergeReturnValue({ task: taskA, originalTask })
  return { task: taskB }
}

// Let calling code handle errored tasks.
// I.e. on exception, successfully return `{ error }` instead of throwing it.
const runTaskHandler = function(error) {
  return { error }
}

const eRunTask = addErrorHandler(runTask, runTaskHandler)

// Error handler for each plugin handler
// Add `error.task` and `error.taskKey`
const runPluginHandler = function(error, { taskKey, ...task }) {
  Object.assign(error, { taskKey, task })
  throw error
}

// Task return value, returned to users and used by depReqs
const mergeReturnValue = function({ task, originalTask }) {
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
  runTask: eRunTask,
}
