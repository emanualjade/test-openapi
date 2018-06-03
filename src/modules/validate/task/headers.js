'use strict'

const { TestOpenApiError } = require('../../../errors')
const { validateFromSchema } = require('../../../utils')

const { validateRequiredHeader } = require('./required')

// Validates response headers against OpenAPI specification
const validateHeaders = function({ schemas: { headers: vHeaders }, response: { headers } }) {
  vHeaders.forEach(({ name, value: schema }) => validateHeader({ name, schema, headers }))
}

const validateHeader = function({ name, schema, headers }) {
  const header = getFetchHeader({ headers, name })

  validateRequiredHeader({ schema, value: header, name })

  if (header === undefined) {
    return
  }

  validateHeaderValue({ name, schema, header })
}

const getFetchHeader = function({ headers, name }) {
  const nameB = Object.keys(headers).find(nameA => nameA.toLowerCase() === name.toLowerCase())

  if (nameB === undefined) {
    return
  }

  return headers[nameB]
}

// Validates response header against JSON schema from specification
const validateHeaderValue = function({ name, schema, header }) {
  const { error } = validateFromSchema({ schema, value: header })

  if (error === undefined) {
    return
  }

  const property = `validate.headers.${name}`
  throw new TestOpenApiError(`Response header '${name}'${error}.`, {
    property,
    schema,
    actual: header,
  })
}

module.exports = {
  validateHeaders,
}
