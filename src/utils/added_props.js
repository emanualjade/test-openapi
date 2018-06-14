'use strict'

const { omitBy } = require('lodash')

// Retrieve the properties from `task.PLUGIN.*` that have been added by this
// plugin, i.e. not in `originalTask.*`
const getAddedProps = function({ task, plugin: { name, config: { task: taskConfig } = {} } }) {
  const taskValue = task[name] || {}

  // If there is no `plugin.config.task`, return `task.*` as is
  if (taskConfig === undefined) {
    return taskValue
  }

  // Since `task.*` never has priority, only `originalTask.*` is returned
  if (!isObjectType({ taskConfig })) {
    return {}
  }

  // `plugin.config.task` is an object. We remove its properties from `task.*`
  const taskValueA = omitBy(taskValue, (value, key) => isConfigProp({ taskConfig, key }))
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
  getAddedProps,
}
