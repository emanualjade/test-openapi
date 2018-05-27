'use strict'

const { mapValues } = require('lodash')

const { isObject } = require('../utils')
const { runHandlers } = require('../plugins')

// Run an `it()` task
const runTask = async function({ originalTask, ...task }, { config, plugins, errors }) {
  const readOnlyArgs = getReadOnlyArgs({ config, plugins, errors })

  const taskA = await runHandlers(
    task,
    plugins,
    'task',
    readOnlyArgs,
    runTaskHandler.bind(null, { errors }),
  )
  // Task return value, returned to users and used by depReqs
  const taskB = mapValues(taskA, (newTask, prop) => shallowMerge(originalTask[prop], newTask))
  return taskB
}

// Passed to every task handler
const getReadOnlyArgs = function({ config, plugins, errors }) {
  // Pass `runTask` for recursive tasks
  // If some plugins (like the `repeat` plugin) monkey patch `runTask()`, the
  // non-monkey patched version is passed instead
  const recursiveRunTask = task => runTask(task, { config, plugins, errors })

  // Those arguments are passed to each task, but cannot be modified
  return { config, runTask: recursiveRunTask }
}

// Error handler for `it()`
// Add `error.task` and `error.taskKey`
const runTaskHandler = function({ errors }, error, { taskKey, ...task }) {
  Object.assign(error, { taskKey, task })

  // Errors collection
  errors.push(error)

  throw error
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
