'use strict'

const { throwTestError } = require('../errors')
const { validateIsSchema } = require('../utils')

const { isSameParam, isSameHeader } = require('./common')

// `test.request.*` must be present in the specification.
// Otherwise this indicates a typo, or the specification can be improved
const validateTestParam = function({ testParam, parameters, name }) {
  const matchesSpec = parameters.some(param => isSameParam(param, testParam))
  if (matchesSpec) {
    return
  }

  const property = `request.${name}`
  throwTestError(`'${property}' does not match any request parameter in the specification`, {
    property,
  })
}

// Same for `test.response.headers.*`
const validateTestHeader = function({ testHeader, testHeader: { name }, headers }) {
  const matchesSpec = headers.some(param => isSameHeader(param, testHeader))
  if (matchesSpec) {
    return
  }

  const property = `response.headers.${name}`
  throwTestError(`'${property}' does not match any response header in the specification`, {
    property,
  })
}

// Validate request parameters and response headers are valid JSON schema v4
// Validate that test values are JSON schemas version 4
// We cannot use later versions because json-schema-faker does not support them
// Must be done after merged to specification, and `deps` have been resolved
const validateTest = function({ request, response: { headers, body } }) {
  request.forEach(({ name, schema }) => validateJsonSchema({ property: `request.${name}`, schema }))
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

  throwTestError(`'${property}' is not a valid JSON schema v4:${error}`, { property })
}

module.exports = {
  validateTestParam,
  validateTestHeader,
  validateTest,
}
