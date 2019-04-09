const { runHandlers } = require('../plugins')

// Run each `plugin.end()`
// They should not throw.
const endTasks = async function({ tasks, config, context, plugins }) {
  // `config` and `tasks` cannot be modified
  await runHandlers({
    type: 'end',
    plugins,
    input: tasks,
    context: { ...context, config },
  })
}

module.exports = {
  endTasks,
}
