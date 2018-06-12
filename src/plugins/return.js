'use strict'

const { omitBy } = require('lodash')

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

const getPluginReturn = function({
  task,
  originalTask,
  plugin: { name, config: { task: taskConfig } = {} },
}) {
  const taskValue = task[name]
  const originalValue = originalTask[name]

  const returnValue = getReturnValue({ taskValue, originalValue, taskConfig })
  if (returnValue === undefined) {
    return
  }

  return { [name]: returnValue }
}

const getReturnValue = function({ taskValue, originalValue, taskConfig }) {
  // If there is no `plugin.config.task`, return `task.*` as is
  if (taskConfig === undefined) {
    return taskValue
  }

  // Since `task.*` never has priority, only `originalTask.*` is returned
  if (!isObjectType({ taskConfig })) {
    return originalValue
  }

  // `plugin.config.task` is an object. We remove its properties from `task.*`
  const taskValueA = omitBy(taskValue, (value, key) => isConfigProp({ taskConfig, key }))

  // This means `originalTask.*` was undefined, but plugin added an empty object.
  // We do not return those because this might just be normalization logic.
  // This is done e.g. by `random` plugin
  if (originalValue === undefined && Object.keys(taskValueA).length === 0) {
    return
  }

  return { ...taskValueA, ...originalValue }
}

// Check if JSON schema is `type` `object`
const isObjectType = function({ taskConfig, taskConfig: { type } }) {
  return type === 'object' || OBJECT_PROPS.some(prop => taskConfig[prop] !== undefined)
}

// `type` is optional, so we guess by looking at properties
const OBJECT_PROPS = [
  'properties',
  'patternProperties',
  'additionalProperties',
  'minProperties',
  'maxProperties',
  'required',
  'dependencies',
  'propertyNames',
]

const isConfigProp = function({
  key,
  taskConfig: { additionalProperties, properties = {}, patternProperties },
}) {
  return (
    (additionalProperties !== undefined && additionalProperties !== false) ||
    properties[key] !== undefined ||
    Object.keys(patternProperties).some(pattern => new RegExp(pattern).test(key))
  )
}

module.exports = {
  getTaskReturn,
}
