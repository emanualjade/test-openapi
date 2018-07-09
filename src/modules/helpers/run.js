'use strict'

const { omit } = require('lodash')

const { promiseThen } = require('../../utils')

// Substitute helpers `{ $$name: arg }` and `$$name` for dynamic values.
// Including in deep properties.
// Helpers are substituted before the task run, e.g. plugins do not need to be helpers-aware.
// Helpers still happen after:
//  - `task|only` plugins: to avoid unnecessary long helpers evaluation on skipped task
//  - `repeat` plugin: to repeat helpers that rely on global state, e.g. `$$random`
//    or `$$task` helpers
// Make sure `task.key` is not checked for helpers
const run = function({ key, ...task }, { helpers }) {
  // No nested `originalTask` in final return value
  // Also prevents resolving helpers twice (in `task` and in `originalTask`)
  const taskA = omit(task, 'originalTask')

  const taskB = helpers(taskA)

  // Update `originalTask` so that helpers are shown evaluated in both return value
  // and reporting
  return promiseThen(taskB, taskC => ({ ...taskC, originalTask: taskC, key }))
}

module.exports = {
  run,
}
