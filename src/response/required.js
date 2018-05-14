'use strict'

// Only response headers|body that are present either in the specification or
// in test.response.* are validated.
// `type: null` means the response header|body must not be present
// `type: [null, ...]` means it is optional
// Otherwise, it is required
// TODO: this does not work when `type` is not top-level in the JSON-schema,
// e.g. `{ not: { type } }`
const validateRequiredness = function({ schema: { type = [] }, value, message }) {
  if (type === 'null') {
    return validateForbidden({ value, message })
  }

  if (!(Array.isArray(type) && type.includes('null'))) {
    return validateRequired({ value, message })
  }
}

const validateForbidden = function({ value, message }) {
  if (value === undefined) {
    return
  }

  throw new Error(`${message} should be empty. However it is:\n${value}`)
}

const validateRequired = function({ value, message }) {
  if (value !== undefined) {
    return
  }

  throw new Error(`${message} should not be empty.`)
}

module.exports = {
  validateRequiredness,
}
