'use strict'

const { runHandlers } = require('./plugins')

// Run an `it()` task
const runTask = async function({ originalTask, ...task }, handlers) {
  const taskA = await runHandlers(task, handlers)
  // Task return value, returned to users and used by depReqs
  // The originalTask properties cannot be overriden
  return { ...taskA, ...originalTask }
}

module.exports = {
  runTask,
}
