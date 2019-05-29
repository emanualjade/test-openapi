import { runHandlers } from '../plugins/handlers.js'

// Run each `plugin.complete()`
export const completeTask = async function({ task, context, plugins }) {
  try {
    // `task` cannot be modified
    await runHandlers({ type: 'complete', plugins, input: task, context })
    return task
    // Errors in `complete` handlers return `task.error`, just like the ones in
    // `run` handlers
  } catch (error) {
    return { ...task, error }
  }
}
