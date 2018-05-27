'use strict'

const { TestOpenApiError } = require('../../../errors')
const { validateFromSchema } = require('../../../utils')

const { validateRequiredHeader } = require('./required')

// Validates response headers against OpenAPI specification
const validateHeaders = function({ validate: { headers: vHeaders }, response: { headers } }) {
  vHeaders.forEach(({ name, value: vHeader }) => validateHeader({ name, vHeader, headers }))
}

const validateHeader = function({ name, vHeader, headers }) {
  const header = getFetchHeader({ headers, name })

  validateRequiredHeader({ schema: vHeader, value: header, name })

  if (header === undefined) {
    return
  }

  validateHeaderValue({ name, vHeader, header })
}

const getFetchHeader = function({ headers, name }) {
  const nameB = Object.keys(headers).find(nameA => nameA.toLowerCase() === name.toLowerCase())

  if (nameB === undefined) {
    return
  }

  return headers[nameB]
}

// Validates response header against JSON schema from specification
const validateHeaderValue = function({ name, vHeader, header }) {
  const { error } = validateFromSchema({ schema: vHeader, value: header })

  if (error === undefined) {
    return
  }

  const property = `response.headers.${name}`
  throw new TestOpenApiError(`Response header '${name}'${error}.`, {
    property,
    expected: vHeader,
    actual: header,
  })
}

module.exports = {
  validateHeaders,
}
