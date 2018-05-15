'use strict'

// Validate OpenAPI specification syntax
const validateOpenApi = function({ spec }) {
  const { errors, warnings } = spec.validate()
  const problems = [...errors, ...warnings]

  if (problems.length === 0) {
    return
  }

  reportOpenApiError({ problems })
}

const reportOpenApiError = function({ problems }) {
  const message = problems.map(getErrorMessage).join(`\n${INDENT}`)
  // type: specification
  throw new Error(`OpenAPI specification is invalid:\n${INDENT}${message}`)
}

const INDENT_LENGTH = 8
const INDENT = ' '.repeat(INDENT_LENGTH)

const getErrorMessage = function({ path, message }) {
  return `At '${path.join('.')}': ${message}`
}

module.exports = {
  validateOpenApi,
}
