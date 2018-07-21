'use strict'

const { pick, omit } = require('lodash')

const { promiseThen } = require('../../../utils')
const { addErrorHandler } = require('../../../errors')
const { substituteHelpers } = require('../../../helpers')
const coreData = require('../../../helpers_vars')

const { getPluginsHelpers } = require('./plugin')
const { helpersHandler } = require('./error')

// Substitute helpers `{ $$name: arg }` and `$$name` for dynamic values.
// Including in deep properties.
// Helpers are substituted before the task run, e.g. plugins do not need to be helpers-aware.
// Helpers still happen after:
//  - `task|only` plugins: to avoid unnecessary long helpers evaluation on skipped task
//  - `repeat` plugin: to repeat helpers that rely on global state, e.g. `$$random`
//    or `$$task` helpers
// We do not provide an utility (e.g. `context.helpers()`) for other plugins to
// use helpers because:
//  - some helpers are task-specific, others not, i.e. we would need to provide
//    different helpers at different stages, creating many issues
//  - helpers are a user-facing feature. Plugin writers can `require()` those
//    helpers directly and use their functions if needed.
const run = function(task, context) {
  const noEvalProps = pick(task, NO_EVAL_PROPS)
  const taskA = omit(task, NO_EVAL_PROPS)

  const { vars, pluginsHelpersMap } = getVars({ task, context })

  const taskB = eSubstituteHelpers(taskA, vars, { path: 'task', pluginsHelpersMap })

  return promiseThen(taskB, taskC => returnTask({ task: taskC, noEvalProps }))
}

// Make sure those properties are not checked for helpers
const NO_EVAL_PROPS = ['originalTask', 'key', 'helpers', 'alias']

const getVars = function({ task, context, context: { config } }) {
  const { pluginsHelpers, pluginsHelpersMap } = getPluginsHelpers({ task, context })

  // Plugin/user-defined helpers have loading priority over core helpers.
  // Like this, adding core helpers is non-breaking.
  // Also this allows overriding / monkey-patching core helpers (which can be
  // either good or bad).
  const vars = { ...coreData, ...pluginsHelpers, ...config.helpers }

  return { vars, pluginsHelpersMap }
}

const eSubstituteHelpers = addErrorHandler(substituteHelpers, helpersHandler)

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
