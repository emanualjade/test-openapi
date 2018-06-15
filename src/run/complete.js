'use strict'

const { runHandlers } = require('../plugins')

// Run each `plugin.complete()`
const completeTask = async function({ task, originalTask, plugins, config }) {
  await runHandlers({}, plugins, 'complete', { task, originalTask, config }, completePluginHandler)
}

const completePluginHandler = function(error, { task }) {
  return { ...task, error }
}

module.exports = {
  completeTask,
}
