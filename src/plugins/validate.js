'use strict'

const { validateFromSchema, validateIsSchema } = require('../validation')

const PLUGIN_SCHEMA = require('./plugin_schema.json')

// Validate export value from plugin
const validatePlugin = function({ plugin }) {
  validateSchema({ plugin })
  validateJsonSchemas({ plugin })
}

const validateSchema = function({ plugin, plugin: { name } }) {
  const { error } = validateFromSchema({ schema: PLUGIN_SCHEMA, value: plugin, name })
  if (error === undefined) {
    return
  }

  const message = `Plugin '${name}' is invalid: ${error}`
  throwPluginError({ name, message })
}

const validateJsonSchemas = function({ plugin: { name, config: pluginConfig = {} } }) {
  Object.entries(pluginConfig).forEach(([propName, schema]) =>
    validateJsonSchema({ schema, name, propName }),
  )
}

const validateJsonSchema = function({ schema, name, propName }) {
  if (schema === undefined) {
    return
  }

  const configPropName = `config.${propName}`
  const { error } = validateIsSchema({ value: schema, name: configPropName })
  if (error === undefined) {
    return
  }

  const message = `Plugin '${name}' is invalid: '${configPropName}' is not a valid JSON schema: ${error}`
  throwPluginError({ name, message })
}

// Throw a `bug` error
const throwPluginError = function({ name, message }) {
  const error = new Error(message)
  error.plugin = name
  throw error
}

module.exports = {
  validatePlugin,
  throwPluginError,
}
