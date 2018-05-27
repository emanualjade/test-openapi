'use strict'

const { throwTaskError } = require('../../errors')
const { validateIsSchema } = require('../../utils')

// Validate request parameters and response headers are valid JSON schema v4
// Validate that task values are JSON schemas version 4
// We cannot use later versions because json-schema-faker does not support them
// Must be done after merged to specification, and `deps` have been resolved
const validateTask = function({ params, validate: { headers, body } }) {
  params.forEach(({ name, schema }) =>
    validateJsonSchema({ property: `parameters.${name}`, schema }),
  )
  headers.forEach(({ name, schema }) =>
    validateJsonSchema({ property: `response.headers.${name}`, schema }),
  )
  validateJsonSchema({ property: 'response.body', schema: body })
}

const validateJsonSchema = function({ property, schema }) {
  const { error } = validateIsSchema({ value: schema })
  if (error === undefined) {
    return
  }

  throwTaskError(`'${property}' is not a valid JSON schema v4:${error}`, { property })
}

module.exports = {
  validateTask,
}
