'use strict'

const { runHandlers } = require('../plugins')

// Run each `plugin.start()`
const startTasks = function({ config, plugins }) {
  return runHandlers('start', plugins, {}, { config })
}

module.exports = {
  startTasks,
}
