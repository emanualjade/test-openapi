'use strict'

const { runHandlers } = require('../plugins')

// Run each `plugin.end()`
// They should not throw.
const endTasks = async function({ tasks, plugins, config, startData }) {
  // `config` and `tasks` cannot be modified
  await runHandlers({
    type: 'end',
    plugins,
    input: tasks,
    context: { config, startData },
  })
}

module.exports = {
  endTasks,
}
