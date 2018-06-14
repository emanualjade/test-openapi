'use strict'

const { runHandlers } = require('../plugins')

// Run each `plugin.complete()`
const completeTask = async function({ task, originalTask, plugins, config }) {
  const taskA = await runHandlers(
    task,
    plugins,
    'complete',
    { originalTask, config },
    completePluginHandler,
  )
  return taskA
}

const completePluginHandler = function(error, { task }) {
  return { ...task, error }
}

module.exports = {
  completeTask,
}
