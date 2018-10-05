'use strict'

const { TestOpenApiError } = require('../../../errors')

// Only response headers|body that are present in `task.validate.*` are validated.
// Whether they are defined or not in the response is validated according to:
//  - if `task.validate.*.x-forbidden: false`: must not be defined
//  - if `task.validate.*.x-optional: false` (default): must be defined
const checkRequired = function({
  schema,
  schema: {
    'x-optional': isOptional = false,
    'x-forbidden': isForbidden = false,
  },
  value,
  property,
  name,
}) {
  if (isForbidden) {
    return validateForbidden({ schema, value, property, name })
  }

  if (!isOptional) {
    return validateRequired({ schema, value, property, name })
  }
}

const validateForbidden = function({ schema, value, property, name }) {
  if (value === undefined) {
    return
  }

  throw new TestOpenApiError(`${name} should be empty`, {
    property,
    schema,
    value,
  })
}

const validateRequired = function({ schema, value, property, name }) {
  if (value !== undefined) {
    return
  }

  throw new TestOpenApiError(`${name} should not be empty`, {
    property,
    schema,
    value,
  })
}

module.exports = {
  checkRequired,
}
