'use strict'

const { omit } = require('lodash')

const { promiseThen } = require('../../utils')

// Substitute helpers `{ $$name: arg }` and `$$name` for dynamic values.
// Including in deep properties.
// Helpers are substituted before the task run, e.g. plugins do not need to be helpers-aware.
// Helpers still happen after:
//  - `task|only` plugin: to avoid unnecessary long helpers evaluation on skipped task
//  - `repeat` plugin: to repeat helpers that rely on global state, e.g. `$$random`
//    or `$$task` helpers
const run = function(task, { helpers }) {
  const taskA = helpers(task)
  return promiseThen(taskA, updateOriginalTask)
}

// Update `originalTask` so that helpers are shown evaluated in both return value
// and reporting
const updateOriginalTask = function(task) {
  // No nested `originalTask`
  const originalTask = omit(task, 'originalTask')
  return { ...task, originalTask }
}

module.exports = {
  run,
}
