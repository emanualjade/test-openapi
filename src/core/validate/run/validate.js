'use strict'

const { getPath } = require('../../../utils')
const { checkIsSchema } = require('../../../validation')

// Make sure `task.validate.*.*` are valid JSON schemas
const validateJsonSchemas = function({ validate }) {
  Object.entries(validate).forEach(validateJsonSchema)
}

const validateJsonSchema = function([prop, value]) {
  const name = getPath(['task', 'validate', prop])
  checkIsSchema({ value, name })
}

module.exports = {
  validateJsonSchemas,
}
