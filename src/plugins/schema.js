'use strict'

const { get } = require('lodash')

const { isObject, validateFromSchema } = require('../utils')
const { TestOpenApiError } = require('../errors')

// Validate plugin-specific configuration
const validatePluginsConfig = function({ config, plugins }) {
  plugins.forEach(plugin => validatePluginConfig({ config, plugin }))
}

const validatePluginConfig = function({
  config,
  plugin: { config: pluginConfig = {}, name: plugin },
}) {
  Object.entries(pluginConfig).forEach(([name, schema]) =>
    validatePropConfig({ config, schema, name, plugin }),
  )
}

const validatePropConfig = function({ config, schema, name, plugin }) {
  // Validation not set for that property
  if (!isObject(schema)) {
    return
  }

  VALIDATORS[name]({ config, schema, name, plugin })
}

// `plugin.config.general.*` validate against top-level configuration
const validateGeneral = function({ config, schema, name, plugin }) {
  validateProp({ taskOrConfig: config, schema, name, plugin })
}

// `plugin.config.task.*` validate against each task
const validateTask = function({ config: { tasks }, schema, name, plugin }) {
  tasks.forEach(task => validateProp({ taskOrConfig: task, schema, name, plugin }))
}

const VALIDATORS = {
  general: validateGeneral,
  task: validateTask,
}

// Validate plugin-specific configuration against a JSON schema specified in
// `plugin.config`
const validateProp = function({ taskOrConfig, schema, name, plugin }) {
  const value = get(taskOrConfig, plugin)
  if (value === undefined) {
    return
  }

  const property = `${name}.${plugin}`

  const { error } = validateFromSchema({ schema, value, name: property })
  if (error === undefined) {
    return
  }

  const { key, taskMessage } = getTaskProps({ task: taskOrConfig, name })

  throw new TestOpenApiError(`Configuration ${taskMessage}is invalid: ${error}`, {
    property,
    key,
    schema,
    actual: value,
  })
}

const getTaskProps = function({ task: { key }, name }) {
  if (name !== 'task') {
    return { taskMessage: '' }
  }

  return { key, taskMessage: `for task '${key}' ` }
}

module.exports = {
  validatePluginsConfig,
}
