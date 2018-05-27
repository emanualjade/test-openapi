'use strict'

const { validateFromSchema, validateIsSchema } = require('../utils')

const EXPORT_SCHEMA = require('./export_schema')

// Validate export values from each plugin
const validateExports = function({ plugins }) {
  plugins.forEach(validateExport)
}

const validateExport = function(plugin) {
  validateSchema({ plugin })
  validateJsonSchemas({ plugin })
}

const validateSchema = function({ plugin, plugin: { name } }) {
  const { error } = validateFromSchema({ schema: EXPORT_SCHEMA, value: plugin, name })
  if (error === undefined) {
    return
  }

  const message = `Plugin '${plugin}' is invalid:${error}`
  throwPluginError({ plugin: name, message })
}

const validateJsonSchemas = function({ plugin: { name: plugin, config: pluginConfig = {} } }) {
  Object.entries(pluginConfig).forEach(([propName, { schema }]) =>
    validateJsonSchema({ schema, plugin, propName }),
  )
}

const validateJsonSchema = function({ schema, plugin, propName }) {
  const name = `config.${propName}`
  const { error } = validateIsSchema({ value: schema, name })
  if (error === undefined) {
    return
  }

  const message = `Plugin '${plugin}' is invalid: '${name}' is not a valid JSON schema:${error}`
  throwPluginError({ plugin, message })
}

// Throw a `bug` error
const throwPluginError = function({ plugin, message }) {
  const error = new Error(message)
  Object.assign(error, { plugin })
  throw error
}

module.exports = {
  validateExports,
}
