'use strict'

const { mapValues } = require('lodash')

const { isObject } = require('../utils')
const { runHandlers } = require('../plugins')

// Run an `it()` task
const runTask = async function({ originalTask, ...task }, { plugins, readOnlyArgs, errors }) {
  const taskA = await runHandlers(
    task,
    plugins,
    'task',
    readOnlyArgs,
    runTaskHandler.bind(null, { errors }),
  )

  const taskB = mergeReturnValue({ task: taskA, originalTask })
  return taskB
}

// Error handler for `it()`
// Add `error.task` and `error.taskKey`
const runTaskHandler = function({ errors }, error, { taskKey, ...task }) {
  Object.assign(error, { taskKey, task })

  // Errors collection
  errors.push(error)

  throw error
}

// Task return value, returned to users and used by depReqs
const mergeReturnValue = function({ task, originalTask }) {
  return mapValues(task, (newTask, prop) => shallowMerge(originalTask[prop], newTask))
}

// Do a shallow merge on each plugin value
// The originalTask properties has less priority
const shallowMerge = function(originalTask, newTask) {
  if (newTask === undefined) {
    return originalTask
  }

  if (!isObject(originalTask) || !isObject(newTask)) {
    return newTask
  }

  return { ...originalTask, ...newTask }
}

module.exports = {
  runTask,
}
