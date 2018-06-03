'use strict'

const { TestOpenApiError } = require('./error')

// Bundle several errors into one
const bundleErrors = function({ errors }) {
  const errorsA = errors.map(convertPlainObject)

  // Top-level error's properties are copied among one of the `errors` thrown
  const [firstError] = errorsA

  return new TestOpenApiError('', { ...firstError, errors: errorsA })
}

// Must do this to convert to plain object while keeping non-enumerable
// properties `error.name|message|stack`
const convertPlainObject = function({ name, message, stack, ...error }) {
  return { ...error, name, message, stack }
}

module.exports = {
  bundleErrors,
  convertPlainObject,
}
