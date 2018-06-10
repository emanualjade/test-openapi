'use strict'

const { TestOpenApiError } = require('../../../errors')
const { validateIsSchema } = require('../../../utils')

// Make sure `task.validate.*.*` are valid JSON schemas
const validateJsonSchemas = function({ validate }) {
  Object.entries(validate).forEach(validateJsonSchema)
}

const validateJsonSchema = function([prop, value]) {
  const { error } = validateIsSchema({ value })
  if (error === undefined) {
    return
  }

  const property = `validate.${prop}`
  throw new TestOpenApiError(`'${property}' is not a valid JSON schema v4:${error}`, {
    property,
  })
}

module.exports = {
  validateJsonSchemas,
}
