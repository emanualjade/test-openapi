'use strict'

const { checkIsSchema } = require('../../../validation')

// Make sure `task.validate.*.*` are valid JSON schemas
const validateJsonSchemas = function({ validate }) {
  Object.entries(validate).forEach(validateJsonSchema)
}

const validateJsonSchema = function([prop, value]) {
  checkIsSchema({
    value,
    propName: `validate.${prop}`,
    message: `'validate.${prop}' is not a valid JSON schema v4:`,
  })
}

module.exports = {
  validateJsonSchemas,
}
