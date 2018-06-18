'use strict'

const { runHandlers } = require('../plugins')

// Run each `plugin.end()`
// They should not throw.
const endTasks = async function({ tasks, plugins, config }) {
  await runHandlers({}, plugins, 'end', { tasks, config })
}

module.exports = {
  endTasks,
}
