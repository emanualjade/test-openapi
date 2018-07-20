'use strict'

const { pick, omit } = require('lodash')

const { promiseThen } = require('../../utils')

// Substitute helpers `{ $$name: arg }` and `$$name` for dynamic values.
// Including in deep properties.
// Helpers are substituted before the task run, e.g. plugins do not need to be helpers-aware.
// Helpers still happen after:
//  - `task|only` plugins: to avoid unnecessary long helpers evaluation on skipped task
//  - `repeat` plugin: to repeat helpers that rely on global state, e.g. `$$random`
//    or `$$task` helpers
const run = function(task, context) {
  const noEvalProps = pick(task, NO_EVAL_PROPS)
  const taskA = omit(task, NO_EVAL_PROPS)

  const taskB = context.helpers(taskA, {}, { path: 'task' })

  return promiseThen(taskB, taskC => returnTask({ task: taskC, noEvalProps }))
}

// Make sure those properties are not checked for helpers
const NO_EVAL_PROPS = ['originalTask', 'key', 'helpers', 'alias']

// Update `originalTask` so that helpers are shown evaluated in both return value
// and reporting
const returnTask = function({ task, noEvalProps }) {
  const taskA = { ...task, ...noEvalProps }

  // No nested `originalTask` in final return value
  const taskB = omit(taskA, 'originalTask')
  return { ...taskB, originalTask: taskB }
}

module.exports = {
  run,
}
