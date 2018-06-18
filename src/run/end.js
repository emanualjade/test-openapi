'use strict'

const { runHandlers } = require('../plugins')

// Run each `plugin.end()`
// They should not throw.
const endTasks = async function({ tasks, plugins, config }) {
  // `config` and `tasks` cannot be modified
  await runHandlers('end', plugins, tasks, { config })
}

module.exports = {
  endTasks,
}
