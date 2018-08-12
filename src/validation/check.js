'use strict'

const { TestOpenApiError, BugError } = require('../errors')

const { validateFromSchema } = require('./validate')

// Validate against JSON schema and on failure throw error with
// `error.value|schema|property` set accordingly
// As opposed to `validateFromSchema()` which is meant to be separated in its
// own repository, this is meant only for this project.
// Values whose key is defined but whose value is `undefined` `opts.value` are
// mostly ignored by ajv except:
//  - if top-level `opts.value` itself is `undefined`
//  - `additionalProperties` and `propertyNames`, but this should be ok since
//    it validates the key not the value
//  - `minProperties|maxProperties`: this is problematic as `undefined` should
//    behave as if the key was not defined. But we'll be ok with it for the moment.
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
