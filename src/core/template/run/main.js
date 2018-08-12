'use strict'

const { pick, omit } = require('lodash')

const { promiseThen } = require('../../../utils')
const { addErrorHandler } = require('../../../errors')
const { evalTemplate } = require('../../../template')
const coreVars = require('../../../template_vars')

const { getPluginsVars } = require('./plugin')
const { templateHandler } = require('./error')

// Substitute templates `{ $$name: arg }` and `$$name` for dynamic values.
// Including in deep properties.
// Templates are substituted before the task run, e.g. plugins do not need to be
// template-aware.
// Templating still happen after:
//  - `task|only` plugins: to avoid unnecessary long template evaluation on skipped task
//  - `repeat` plugin: to repeat template variables that rely on global state,
//     e.g. `$$random` or `$$task`
// We do not provide an utility (e.g. `context.template()`) for other plugins to
// use templating because:
//  - some template variables are task-specific, others not, i.e. we would need
//    to provide different template variables at different stages, creating many issues
//  - templating is a user-facing feature. Plugin writers can `require()`
//    template functions directly and use their functions if needed.
const run = function(task, context) {
  const noEvalProps = pick(task, NO_EVAL_PROPS)
  const taskA = omit(task, NO_EVAL_PROPS)

  const { vars, pluginsVarsMap } = getVars({ context })

  const taskB = eEvalTemplate(taskA, vars, { pluginsVarsMap })

  return promiseThen(taskB, taskC => returnTask({ task: taskC, noEvalProps }))
}

// Make sure those properties are not checked for templating
const NO_EVAL_PROPS = ['originalTask', 'key', 'alias']

const getVars = function({ context, context: { config } }) {
  const { pluginsVars, pluginsVarsMap } = getPluginsVars({ context })

  // Plugin/user-defined template variable have loading priority over core ones.
  // Like this, adding core template variables is non-breaking.
  // Also this allows overriding / monkey-patching core (which can be
  // either good or bad).
  const vars = { ...coreVars, ...pluginsVars, ...config.template }

  return { vars, pluginsVarsMap }
}

const eEvalTemplate = addErrorHandler(evalTemplate, templateHandler)

// Update `originalTask` so that templates are shown evaluated in both return value
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
