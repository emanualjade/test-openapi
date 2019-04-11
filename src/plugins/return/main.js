import { omitBy } from 'lodash'

import { isObject } from '../../utils/types.js'

import { getAddedProps } from './added.js'

// Each task plugin returns itself (i.e. `task.PLUGIN_NAME`):
//  - task config properties (i.e. specified in `plugin.config.task.*`) are
//    kept as their original input. The reason is to make it predictable that
//    any user input is also present unchanged in the output.
//  - other properties that have been added by the task handler are returned too
// Note that `task.done` is not kept
export const getTaskReturn = function({
  task,
  task: { key, scope, name, skipped, error, originalTask },
  plugins,
}) {
  const pluginReturns = getPluginReturns({ plugins, task })

  // Enforce properties order: `key`, `skipped`, `error`, added `task.*`,
  // original `task.*`
  // `originalTask` is kept only for reporters
  const taskA = {
    key,
    scope,
    name,
    skipped,
    error,
    ...pluginReturns,
    originalTask,
  }

  // Do not clutter with plugins that have nothing to return
  const taskB = omitBy(taskA, value => value === undefined)

  return taskB
}

// Keep `originalTask.*` for properties in `plugin.config.task.*`
const getPluginReturns = function({ plugins, task }) {
  const pluginReturns = plugins.map(plugin => getPluginReturn({ task, plugin }))
  const pluginReturnsA = Object.assign({}, ...pluginReturns)
  return pluginReturnsA
}

const getPluginReturn = function({ task, plugin, plugin: { name } }) {
  const returnValue = getReturnValue({ task, plugin })

  if (returnValue === undefined) {
    return
  }

  return { [name]: returnValue }
}

const getReturnValue = function({
  task,
  task: { originalTask },
  plugin,
  plugin: { name },
}) {
  const addedProps = getAddedProps({ task, plugin })

  const originalValue = originalTask[name]

  if (addedProps === undefined) {
    return originalValue
  }

  if (!isObject(addedProps)) {
    return addedProps
  }

  return { ...addedProps, ...originalValue }
}
