'use strict'

const { runHandlers } = require('../plugins')

// Run each `plugin.start()`
const startTasks = async function({ config, config: { tasks }, plugins }) {
  const configA = await runHandlers('start', plugins, config)
  // Only allow modifying `tasks` in `plugin.load()`
  return { ...configA, tasks }
}

module.exports = {
  startTasks,
}
