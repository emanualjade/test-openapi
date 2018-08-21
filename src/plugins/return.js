'use strict'

const { omitBy } = require('lodash')

const { isObject } = require('../utils')

// Each task plugin returns itself (i.e. `task.PLUGIN_NAME`):
//  - task config properties (i.e. specified in `plugin.config.task.*`) are
//    kept as their original input. The reason is to make it predictable that
//    any user input is also present unchanged in the output.
//  - other properties that have been added by the task handler are returned too
// Note that `task.done` is not kept
const getTaskReturn = function({
  task,
  task: { key, scope, name, skipped, error, originalTask },
  plugins,
}) {
  const pluginReturns = getPluginReturns({ plugins, task })

  // Enforce properties order: `key`, `skipped`, `error`, added `task.*`, original `task.*`
  // `originalTask` is kept only for reporters
  const taskA = { key, scope, name, skipped, error, ...pluginReturns, originalTask }

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

const getReturnValue = function({ task, task: { originalTask }, plugin, plugin: { name } }) {
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

// Retrieve the properties from `task.PLUGIN.*` that have been added by this
// plugin, i.e. not in `originalTask.*`
const getAddedProps = function({ task, plugin: { name, config: { task: taskConfig } = {} } }) {
  const taskValue = task[name]

  // If there is no `plugin.config.task`, return `task.*` as is
  if (taskConfig === undefined) {
    return taskValue
  }

  // Since `task.*` never has priority, only `originalTask.*` is returned
  if (!isObjectType({ taskConfig })) {
    return
  }

  // `plugin.config.task` is an object. We remove its properties from `task.*`
  const taskValueA = omitBy(taskValue, (value, key) => shouldSkipProp({ value, key, taskConfig }))

  if (Object.keys(taskValueA).length === 0) {
    return
  }

  return taskValueA
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

const shouldSkipProp = function({ value, key, taskConfig }) {
  // If a plugin returned `task.*: undefined`, we do not keep in task return value
  // Input `undefined` (i.e. from `originalTask`) are kept though.
  return value === undefined || isConfigProp({ key, taskConfig })
}

// If a `task.*` is in `plugin.config`, it is not an `addedProp`
const isConfigProp = function({
  key,
  taskConfig: { additionalProperties, properties = {}, patternProperties = {} },
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
