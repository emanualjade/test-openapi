import { omitBy } from 'lodash'

// Retrieve the properties from `task.PLUGIN.*` that have been added by this
// plugin, i.e. not in `originalTask.*`
export const getAddedProps = function({
  task,
  plugin: { name, config: { task: taskConfig } = {} },
}) {
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
  const taskValueA = omitBy(taskValue, (value, key) =>
    shouldSkipProp({ value, key, taskConfig }),
  )

  if (Object.keys(taskValueA).length === 0) {
    return
  }

  return taskValueA
}

// Check if JSON schema is `type` `object`
const isObjectType = function({ taskConfig, taskConfig: { type } }) {
  return (
    type === 'object' ||
    OBJECT_PROPS.some(prop => taskConfig[prop] !== undefined)
  )
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
  // If a plugin returned `task.*: undefined`, we do not keep in task return
  // value
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
    Object.keys(patternProperties).some(pattern =>
      new RegExp(pattern, 'u').test(key),
    )
  )
}
