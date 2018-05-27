'use strict'

const { pick } = require('lodash')

const { runHandlers } = require('./plugins')

// Run an `it()` task
const runTask = async function({ originalTask, ...task }, handlers, plugins) {
  const taskA = await runHandlers(task, handlers)
  const taskB = getTaskReturn({ task: taskA, originalTask, plugins })
  return taskB
}

// Task return value, returned to users and used by depReqs
// Re-use the original task, and add any `plugin.properties.success`
// (unless it was already in original task)
const getTaskReturn = function({
  task,
  originalTask,
  plugins: {
    properties: { success: successProperties },
  },
}) {
  const taskA = pick(task, successProperties)
  return { ...taskA, ...originalTask }
}

module.exports = {
  runTask,
}
