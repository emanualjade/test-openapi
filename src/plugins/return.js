'use strict'

const { getAddedProps } = require('../utils')

// Each task plugin returns itself (i.e. `task.PLUGIN_NAME`):
//  - task config properties (i.e. specified in `plugin.config.task.*`) are
//    kept as their original input. The reason is to make it predictable that
//    any user input is also present unchanged in the output.
//  - other properties that have been added by the task handler are returned too
const getTaskReturn = function({
  task,
  task: { key },
  originalTask,
  plugins,
  aborted = false,
  error,
}) {
  const errorObj = getError({ error, aborted })

  const pluginReturns = getPluginReturns({ plugins, task, originalTask })

  // Enforce properties order: `key`, `error`, added `task.*`, original `task.*`, `aborted`
  return { key, ...errorObj, ...pluginReturns, aborted }
}

// When aborting a task, this means it was stopped but should be considered a success
const getError = function({ error, aborted }) {
  if (aborted || error === undefined) {
    return
  }

  return { error }
}

// Keep `originalTask.*` for properties in `plugin.config.task.*`
const getPluginReturns = function({ plugins, task, originalTask }) {
  const pluginReturns = plugins.map(plugin => getPluginReturn({ task, originalTask, plugin }))
  const pluginReturnsA = Object.assign({}, ...pluginReturns)
  return pluginReturnsA
}

const getPluginReturn = function({ task, originalTask, plugin, plugin: { name } }) {
  const returnValue = getReturnValue({ task, originalTask, plugin })
  if (returnValue === undefined) {
    return
  }

  return { [name]: returnValue }
}

const getReturnValue = function({ task, originalTask, plugin, plugin: { name } }) {
  const addedProps = getAddedProps({ task, plugin })

  const originalValue = originalTask[name]

  // This means `originalTask.*` was undefined, but plugin added an empty object.
  // We do not return those because this might just be normalization logic.
  // This is done e.g. by `random` plugin
  if (originalValue === undefined && Object.keys(addedProps).length === 0) {
    return
  }

  return { ...addedProps, ...originalValue }
}

module.exports = {
  getTaskReturn,
}
