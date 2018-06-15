'use strict'

const { omit } = require('lodash')

const { runHandlers } = require('../plugins')

// Run each `plugin.end()`
// They should not throw.
const endTasks = async function({ tasks, plugins, config }) {
  await runHandlers({}, plugins, 'end', { tasks, config })

  return tasks.map(task => omit(task, 'originalTask'))
}

module.exports = {
  endTasks,
}
