'use strict'

const { validateFromSchema, validateIsSchema } = require('../utils')

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
  throwPluginError({ plugin: name, message })
}

const validateJsonSchemas = function({ plugin: { name: plugin, config: pluginConfig = {} } }) {
  Object.entries(pluginConfig).forEach(([propName, schema]) =>
    validateJsonSchema({ schema, plugin, propName }),
  )
}

const validateJsonSchema = function({ schema, plugin, propName }) {
  if (schema === undefined) {
    return
  }

  const name = `config.${propName}`
  const { error } = validateIsSchema({ value: schema, name })
  if (error === undefined) {
    return
  }

  const message = `Plugin '${plugin}' is invalid: '${name}' is not a valid JSON schema: ${error}`
  throwPluginError({ plugin, message })
}

// Throw a `bug` error
const throwPluginError = function({ plugin, message }) {
  const error = new Error(message)
  error.plugin = plugin
  throw error
}

module.exports = {
  validatePlugin,
}
