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

  // Throw a `bug` error
  const errorA = new Error(
    `Plugin '${name}' is invalid: 'config.${propName}' is not a valid JSON schema: ${error}`,
  )
  errorA.plugin = name
  throw errorA
}

module.exports = {
  validateJsonSchemas,
}
