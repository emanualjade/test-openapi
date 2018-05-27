'use strict'

const { pick } = require('lodash')

const { reduceAsync } = require('../utils')

// Run an `it()` task
const runTask = async function({ originalTask, ...task }, handlers) {
  const taskA = await runTaskPlugins({ task, handlers })

  const taskB = getTaskReturn({ task: taskA, originalTask })
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
const getTaskReturn = function({ task, originalTask }) {
  // TODO: use `returnedProperties` instead
  const taskA = pick(task, ['request', 'response'])

  // Any value set on `task.*` by a plugin is returned, unless it already existed
  // in original task
  return { ...taskA, ...originalTask }
}

module.exports = {
  runTask,
}
