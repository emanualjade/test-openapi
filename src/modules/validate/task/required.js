'use strict'

const { TestOpenApiError } = require('../../../errors')

// Only response headers|body that are present in `task.validate.*` are validated.
// `type: null` means the response header|body must not be present
// `type: [null, ...]` means it is optional
// Otherwise, it is required
// TODO: this does not work when `type` is not top-level in the JSON-schema,
// e.g. `{ not: { type } }`
const validateRequiredBody = function({ schema, value }) {
  const message = validateRequiredness({ schema, value })
  if (message === undefined) {
    return
  }

  const property = 'call.response.body'
  throw new TestOpenApiError(`Response body ${message}`, {
    property,
    expected: schema,
    actual: value,
  })
}

const validateRequiredHeader = function({ schema, value, name }) {
  const message = validateRequiredness({ schema, value })
  if (message === undefined) {
    return
  }

  const property = `call.response.headers.${name}`
  throw new TestOpenApiError(`Response header '${name}' ${message}`, {
    property,
    expected: schema,
    actual: value,
  })
}

const validateRequiredness = function({ schema: { type = [] }, value }) {
  if (type === 'null') {
    return validateForbidden({ value })
  }

  if (!(Array.isArray(type) && type.includes('null'))) {
    return validateRequired({ value })
  }
}

const validateForbidden = function({ value }) {
  if (value === undefined) {
    return
  }

  return 'should be empty.'
}

const validateRequired = function({ value }) {
  if (value !== undefined) {
    return
  }

  return 'should not be empty.'
}

module.exports = {
  validateRequiredBody,
  validateRequiredHeader,
}
