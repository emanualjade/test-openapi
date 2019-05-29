import SwaggerParser from 'swagger-parser'

import { TestOpenApiError } from '../../../errors/error.js'

// Parses an OpenAPI file (including JSON references)
// Can also be a URL or directly an object
// Also validates its syntax
export const loadOpenApiSpec = async function({ spec }) {
  try {
    return await SwaggerParser.validate(spec)
  } catch (error) {
    loadSpecHandler(error)
  }
}

const loadSpecHandler = function({ message, details }) {
  if (!Array.isArray(details)) {
    fetchSpecHandler({ message })
  }

  invalidSpecHandler({ details })
}

// Validate OpenAPI file exists and can be fetched
const fetchSpecHandler = function({ message }) {
  throw new TestOpenApiError(
    `OpenAPI specification could not be loaded: ${message}`,
  )
}

// Validate OpenAPI specification syntax
const invalidSpecHandler = function({ details, details: [{ path }] }) {
  const message = details.map(getErrorMessage).join(`\n${INDENT}`)
  throw new TestOpenApiError(
    `OpenAPI specification is invalid at ${path.join(
      '.',
    )}:\n${INDENT}${message}`,
  )
}

const INDENT_LENGTH = 4
const INDENT = ' '.repeat(INDENT_LENGTH)

const getErrorMessage = function({ path, message }) {
  return `At '${path.join('.')}': ${message}`
}
