'use strict'

const { runHandlers } = require('../plugins')

// Run each `plugin.start()`
const startTasks = function({ config, plugins }) {
  return runHandlers(config, plugins, 'start')
}

module.exports = {
  startTasks,
}
