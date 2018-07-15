'use strict'

const { validateIsSchema } = require('../validation')

// Validate export value `config` are JSON schemas
const validateJsonSchemas = function({ plugin: { name, config = {} } }) {
  Object.entries(config).forEach(([propName, schema]) =>
    validateJsonSchema({ schema, name, propName }),
  )
}

const validateJsonSchema = function({ schema, name, propName }) {
  const { error } = validateIsSchema({ value: schema, name: `config.${propName}` })
  if (error === undefined) {
    return
  }

  const message = `Plugin '${name}' is invalid: 'config.${propName}' is not a valid JSON schema: ${error}`
  throwPluginError({ name, message })
}

// Throw a `bug` error
const throwPluginError = function({ name, message }) {
  const error = new Error(message)
  error.plugin = name
  throw error
}

module.exports = {
  validateJsonSchemas,
}
