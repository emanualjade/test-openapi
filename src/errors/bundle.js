'use strict'

const { TestOpenApiError } = require('./error')

// Bundle several errors into one
const bundleErrors = function({ errors }) {
  // Only keep top-level stack
  const [{ stack }] = errors

  const errorsA = errors.map(convertPlainObject)

  // Top-level error's properties are copied among one of the `errors` thrown
  const [firstError] = errorsA

  return new TestOpenApiError('', { ...firstError, stack, errors: errorsA })
}

// Must do this to convert to plain object while keeping non-enumerable
// properties `error.name|message`
const convertPlainObject = function({ name, message, ...error }) {
  return { ...error, name, message }
}

module.exports = {
  bundleErrors,
  convertPlainObject,
}
