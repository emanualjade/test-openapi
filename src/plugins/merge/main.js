'use strict'

const { mergeParams, mergeHeaders } = require('../../utils')

const { mergeSpec, mergeSpecSchema } = require('./common')
const { validateTask } = require('./validation')

// Merge tasks to specification
const mergeTask = function({ params, validate, operation }) {
  // Merge HTTP request parameters to specification
  const paramsA = mergeParams([...operation.params, ...params], mergeSpec)
  const validateA = mergeValidate({ validate, operation })

  validateTask({ params: paramsA, validate: validateA })

  return { params: paramsA, validate: validateA }
}

// Merge `task.validate.*` into specification
const mergeValidate = function({ operation, validate: { status, headers, body } }) {
  // Merge `task.validate.headers.*` to specification
  const headersA = mergeHeaders([...operation.response.headers, ...headers], mergeSpec)
  const bodyA = mergeBody({ operation, body })

  const validateA = { status, headers: headersA, body: bodyA }
  return validateA
}

// Merge `task.validate.body` to specification
const mergeBody = function({ operation, body }) {
  if (body === undefined) {
    return operation.response.body
  }

  const schema = mergeSpecSchema(operation.response.body, body)
  return schema
}

module.exports = {
  mergeTask,
}
