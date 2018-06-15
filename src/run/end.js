'use strict'

const { runHandlers } = require('../plugins')

// Run each `plugin.end()`
// They should not throw.
const endTasks = function({ tasks, plugins, config }) {
  return runHandlers({}, plugins, 'end', { tasks, config })
}

module.exports = {
  endTasks,
}
