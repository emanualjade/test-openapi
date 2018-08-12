'use strict'

const { TestOpenApiError, BugError } = require('../errors')

const { validateFromSchema } = require('./validate')

// Validate against JSON schema and on failure throw error with
// `error.value|schema|property` set accordingly
// As opposed to `validateFromSchema()` which is meant to be separated in its
// own repository, this is meant only for this project.
const checkSchema = function({ bug = false, ...opts }) {
  const error = validateFromSchema(opts)
  if (error === undefined) {
    return
  }

  const ErrorType = bug ? BugError : TestOpenApiError
  const { message } = error
  const errorProps = getErrorProps({ opts, error })

  throw new ErrorType(message, errorProps)
}

const getErrorProps = function({
  opts: { schemaProp, props },
  error: { value, schema, valuePath, schemaPath },
}) {
  const property = schemaProp === undefined ? valuePath : schemaPath
  return { value, schema, property, ...props }
}

module.exports = {
  checkSchema,
}
