'use strict'

const { pick, omit } = require('lodash')

const { promiseThen } = require('../../../utils')
const { addErrorHandler } = require('../../../errors')
const { evalTemplate } = require('../../../template')

const { getPluginsVars } = require('./plugin')
const { templateHandler } = require('./error')

// Substitute templates `{ $$name: arg }` and `$$name` for dynamic values.
// Including in deep properties.
// Templates are substituted before the task run, e.g. plugins do not need to be
// template-aware.
// Templating still happen after:
//  - `task|only` plugins: to avoid unnecessary long template evaluation on
//     skipped task
//  - `repeat` plugin: to repeat template variables that rely on global state,
//     e.g. `$$random` or `$$task`
// We do not provide an utility (e.g. `context.template()`) for other plugins to
// use templating because:
//  - some template variables are task-specific, others not, i.e. we would need
//    to provide different template variables at different stages, creating
//    many issues
//  - templating is a user-facing feature. Plugin writers can `require()`
//    template functions directly and use their functions if needed.
const run = function(task, context) {
  const { vars, pluginsVarsMap } = getVars({ task, context })

  const noEvalProps = pick(task, NO_EVAL_PROPS)
  const taskA = omit(task, NO_EVAL_PROPS)

  const taskB = eEvalTaskTemplate({ task: taskA, vars, pluginsVarsMap })

  return promiseThen(taskB, taskC => returnTask({ task: taskC, noEvalProps }))
}

// Make sure those properties are not checked for templating
const NO_EVAL_PROPS = ['originalTask', 'key', 'variables', 'template']

// Retrieving variables cannot happen during a `start` handler because we might
// need to pass `context._runTask()`, e.g. to `variables` `plugin.template()`
const getVars = function({ task: { template: taskTemplates }, context }) {
  const { pluginsVars, pluginsVarsMap } = getPluginsVars({ context })

  const vars = { ...pluginsVars, ...taskTemplates }

  return { vars, pluginsVarsMap }
}

const evalTaskTemplate = function({ task, vars }) {
  return evalTemplate(task, vars)
}

const eEvalTaskTemplate = addErrorHandler(evalTaskTemplate, templateHandler)

// Update `originalTask` so that templates are shown evaluated in both return
// value and reporting
const returnTask = function({ task, noEvalProps }) {
  const taskA = { ...task, ...noEvalProps }

  // No nested `originalTask` in final return value
  const taskB = omit(taskA, 'originalTask')
  return { ...taskB, originalTask: taskB }
}

module.exports = {
  run,
}
