import { runHandlers } from '../plugins/handlers.js'

// Run each `plugin.end()`
// They should not throw.
export const endTasks = async function({ tasks, config, context, plugins }) {
  // `config` and `tasks` cannot be modified
  await runHandlers({
    type: 'end',
    plugins,
    input: tasks,
    context: { ...context, config },
  })
}
