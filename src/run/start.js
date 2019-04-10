import { runHandlers } from '../plugins/handlers.js'

// Run each `plugin.start()`
// Meant to modify `startData` (initialized to empty object)
// Each plugin can access/modify other `startData.PLUGIN`
// `startData` is meant for data that should only be computed once for all tasks
// It can be cleaned up in `end` handlers
// It is passed as `context.startData` to the next handlers.
// Alternatives could have been:
//  - let users memoize. However memoization would need be async, and re-created
//    at each run, so there are many rooms for errors and it creates burden
//    on users.
//  - make `run` handler a function that returns a function.
//    This does not allow cleanup though.
export const startTasks = function({ config, context, plugins }) {
  return runHandlers({
    type: 'start',
    plugins,
    input: {},
    context: { ...context, config },
  })
}
