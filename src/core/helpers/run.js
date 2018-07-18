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
const run = function(task, context) {
  // Make sure `task.key|helpers` are not checked for helpers
  const { key, helpers, ...taskA } = task

  // No nested `originalTask` in final return value
  // Also prevents resolving helpers twice (in `task` and in `originalTask`)
  const taskB = omit(taskA, 'originalTask')

  const taskC = context.helpers(taskB, ['task'])

  return promiseThen(taskC, taskD => returnTask({ task: taskD, key, helpers }))
}

// Update `originalTask` so that helpers are shown evaluated in both return value
// and reporting
const returnTask = function({ task, key, helpers }) {
  const taskA = { ...task, key, helpers }
  return { ...taskA, originalTask: taskA }
}

module.exports = {
  run,
}
