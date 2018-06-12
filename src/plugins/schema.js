'use strict'

const { get } = require('lodash')

const { isObject, validateFromSchema } = require('../utils')
const { TestOpenApiError } = require('../errors')

// Validate plugin-specific configuration
const validatePluginsConfig = function({ config, plugins }) {
  plugins.forEach(plugin => validatePluginConfig({ config, plugin }))
}

const validatePluginConfig = function({ config, plugin: { config: pluginConfig = {}, name } }) {
  Object.entries(pluginConfig).forEach(([propName, { schema }]) =>
    validatePropConfig({ config, propName, schema, name }),
  )
}

const validatePropConfig = function({ config, propName, schema, name }) {
  // Validation not set for that property
  if (!isObject(schema)) {
    return
  }

  const { path, type } = getPropPath({ propName, name })

  VALIDATORS[type]({ config, path, schema })
}

// From `general.example` to `{ path: 'pluginName.example', type: 'general' }`
const getPropPath = function({ propName, name }) {
  const [type, ...propNameA] = propName.split('.')
  const path = [name, ...propNameA].join('.')
  return { path, type }
}

// `plugin.config.general.*` validate against top-level configuration
const validateGeneral = function({ config, path, schema }) {
  validateProp({ taskOrConfig: config, path, schema, name: 'config' })
}

// `plugin.config.task.*` validate against each task
const validateTask = function({ config: { tasks }, path, schema }) {
  tasks.forEach(task => validateProp({ taskOrConfig: task, path, schema, name: 'task' }))
}

const VALIDATORS = {
  general: validateGeneral,
  task: validateTask,
}

// Validate plugin-specific configuration against a JSON schema specified in
// `plugin.config`
const validateProp = function({ taskOrConfig, path, schema, name }) {
  const value = get(taskOrConfig, path)
  if (value === undefined) {
    return
  }

  const { error } = validateFromSchema({ schema, value, name: `${name}.${path}` })
  if (error === undefined) {
    return
  }

  const { key, taskMessage } = getTaskProps({ task: taskOrConfig, name })

  throw new TestOpenApiError(`Configuration ${taskMessage}is invalid: ${error}`, {
    property: path,
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
