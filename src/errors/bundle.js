'use strict'

const { omit } = require('lodash')

const { TestOpenApiError } = require('./error')

// Bundle several errors into one
const bundleErrors = function({ errors }) {
  const bugError = errors.find(({ type }) => type === 'bug')
  if (bugError !== undefined) {
    return bugError
  }

  const firstError = getTopError({ errors })

  const errorsA = errors.map(convertError)

  const error = new TestOpenApiError('', { ...firstError, errors: errorsA })
  return error
}

// Top-level error's properties are copied among one of the `errors` thrown
const getTopError = function({ errors: [firstError] }) {
  const firstErrorA = convertPlainObject(firstError)
  return { ...firstErrorA, message: ERROR_MESSAGE }
}

const ERROR_MESSAGE = 'Some tasks failed'

// Convert ot plain object. Discard `error.name|stack` but not `error.message`
const convertError = function(error) {
  const errorA = convertPlainObject(error)
  const errorB = omit(errorA, 'stack')
  return errorB
}

// Convert ot plain object. Must do it like this to keep `error.stack|message`
const convertPlainObject = function({ message, stack, ...error }) {
  return { ...error, message, stack }
}

// Bundle single error with `bundleErrors()` unless it's already bundled
const bundleSingleError = function({ error }) {
  if (error.errors) {
    return error
  }

  return bundleErrors({ errors: [error] })
}

module.exports = {
  bundleErrors,
  bundleSingleError,
}
