'use strict'

const { pick, omit } = require('lodash')

const { promiseThen } = require('../../utils')
const { addErrorHandler } = require('../../errors')
const { substituteHelpers } = require('../../helpers')

const coreHelpers = require('./core')

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

  const data = getData({ task, context })

  const taskB = eSubstituteHelpers(taskA, data, { path: 'task' })

  return promiseThen(taskB, taskC => returnTask({ task: taskC, noEvalProps }))
}

// Make sure those properties are not checked for helpers
const NO_EVAL_PROPS = ['originalTask', 'key', 'helpers', 'alias']

const getData = function({ task, context, context: { config, _plugins: plugins } }) {
  const pluginsHelpers = getPluginsHelpers({ plugins, task, context })

  // Plugin/user-defined helpers have loading priority over core helpers.
  // Like this, adding core helpers is non-breaking.
  // Also this allows overriding / monkey-patching core helpers (which can be
  // either good or bad).
  const data = { ...coreHelpers, ...pluginsHelpers, ...config.helpers }
  return data
}

// Retrieve all `plugin.helpers`
const getPluginsHelpers = function({ plugins, task, context }) {
  const pluginHelpers = plugins.map(plugin => getPluginHelper({ plugin, task, context }))
  const pluginHelpersA = Object.assign({}, ...pluginHelpers)
  return pluginHelpersA
}

const getPluginHelper = function({ plugin: { helpers }, task, context }) {
  if (helpers === undefined) {
    return
  }

  if (typeof helpers !== 'function') {
    return helpers
  }

  const helpersA = helpers(task, context)
  return helpersA
}

// Allow prepending a `path` to thrown `error.property`
const contextHelpersHandler = function(error, data, opts, value, dataOverride, { path } = {}) {
  const errorA = prependPath({ error, path })
  throw errorA
}

const prependPath = function({ error, error: { property }, path }) {
  if (path === undefined || property === undefined) {
    return error
  }

  error.property = `${path}.${property}`
  return error
}

const eSubstituteHelpers = addErrorHandler(substituteHelpers, contextHelpersHandler)

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
