'use strict'

const { validateFromSchema } = require('./json_schema')

// Validates response status code against OpenAPI specification
const validateStatus = function({
  test: {
    response: { status: schema },
  },
  resStatus,
}) {
  const error = validateFromSchema({ schema, value: resStatus, name: `status code` })
  if (!error) {
    return
  }

  const errorA = getStatusError({ schema, error })
  throw new Error(`Invalid HTTP response status code ${resStatus}: it ${errorA}`)
}

const getStatusError = function({ schema, error }) {
  if (schema.enum) {
    return `should be ${schema.enum.join(', ')}`
  }

  return error
}

module.exports = {
  validateStatus,
}
