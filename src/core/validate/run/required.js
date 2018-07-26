'use strict'

const { TestOpenApiError } = require('../../../errors')

// Only response headers|body that are present in `task.validate.*` are validated.
// Whether they are defined or not in the response is validated according to
// `task.validate.*.x-defined` among:
//   - `required` (default)
//   - `optional`
//   - `forbidden`
const checkRequired = function({
  schema,
  schema: { 'x-defined': defined = DEFAULT_DEFINED },
  value,
  property,
  name,
}) {
  const validator = DEFINED_VALIDATE[defined]
  if (validator === undefined) {
    return
  }

  const message = validator({ value })
  if (message === undefined) {
    return
  }

  throw new TestOpenApiError(`${name} ${message}`, { property, schema, value })
}

const DEFAULT_DEFINED = 'required'

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

const DEFINED_VALIDATE = {
  forbidden: validateForbidden,
  required: validateRequired,
}

module.exports = {
  checkRequired,
}
