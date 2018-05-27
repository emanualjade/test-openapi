'use strict'

const { pick } = require('lodash')

const { reduceAsync } = require('../utils')

// Run an `it()` task
const runTask = async function({ originalTask, ...task }, handlers, plugins) {
  const taskA = await runTaskPlugins({ task, handlers })

  const taskB = getTaskReturn({ task: taskA, originalTask, plugins })
  return taskB
}

const runTaskPlugins = function({ task, handlers }) {
  return reduceAsync(handlers, runPlugin, task, mergePlugin)
}

const runPlugin = function(task, plugin) {
  return plugin(task)
}

// We merge the return value of each plugin
const mergePlugin = function(task, taskA) {
  return { ...task, ...taskA }
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
