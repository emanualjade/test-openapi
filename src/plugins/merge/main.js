'use strict'

const { mergeParams } = require('./params')
const { mergeValidate } = require('./validate')
const { validateTask } = require('./validation')

// Merge tasks to specification
const mergeTask = function({ params, validate, operation }) {
  const paramsA = mergeParams({ params, operation })
  const validateA = mergeValidate({ validate, operation })

  validateTask({ params: paramsA, validate: validateA })

  return { params: paramsA, validate: validateA }
}

module.exports = {
  mergeTask,
}
