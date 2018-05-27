'use strict'

const { validateFromSchema } = require('../utils')

const EXPORT_SCHEMA = require('./export_schema')

// Validate export values from each plugin
const validateExports = function({ plugins }) {
  plugins.forEach(validateExport)
}

const validateExport = function(plugin) {
  validateSchema({ plugin })
}

const validateSchema = function({ plugin, plugin: { name } }) {
  const { error } = validateFromSchema({ schema: EXPORT_SCHEMA, value: plugin, name })
  if (error === undefined) {
    return
  }

  // Throw a `bug` error
  throwPluginError({ plugin: name, error })
}

const throwPluginError = function({ plugin, error }) {
  const errorA = new Error(`Plugin '${plugin}' is invalid: ${error}`)
  Object.assign(errorA, { plugin })
  throw errorA
}

module.exports = {
  validateExports,
}
