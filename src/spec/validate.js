'use strict'

const { throwSpecificationError } = require('../errors')

// Validate OpenAPI specification syntax
const validateOpenApi = function({ spec }) {
  const { errors, warnings } = spec.validate()
  const problems = [...errors, ...warnings]

  if (problems.length === 0) {
    return
  }

  reportOpenApiError({ problems })
}

const reportOpenApiError = function({ problems, problems: [{ path }] }) {
  const message = problems.map(getErrorMessage).join(`\n${INDENT}`)
  const property = path.join('.')
  throwSpecificationError(`OpenAPI specification is invalid:\n${INDENT}${message}`, { property })
}

const INDENT_LENGTH = 4
const INDENT = ' '.repeat(INDENT_LENGTH)

const getErrorMessage = function({ path, message }) {
  return `At '${path.join('.')}': ${message}`
}

module.exports = {
  validateOpenApi,
}
