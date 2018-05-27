'use strict'

const { keyToLocation } = require('../../utils')

const { mergeTaskParams } = require('./common')
const { validateTaskParam } = require('./validation')

// Merge HTTP request parameters to specification
const mergeParams = function({ params = {}, operation }) {
  const taskParams = getTaskParams({ params, operation })

  const paramsA = mergeTaskParams([...operation.params, ...taskParams])

  return paramsA
}

// Translate `task.parameters` into request parameters
const getTaskParams = function({ params, operation }) {
  return Object.entries(params).map(([key, schema]) => getTaskParam({ key, schema, operation }))
}

const getTaskParam = function({ key, schema, operation }) {
  const { location, name } = keyToLocation({ key })

  // Parameters specified in `task.parameters.*` are always required (i.e. generated)
  const taskParam = { schema, required: true, location, name }

  validateTaskParam({ taskParam, operation, key })

  return taskParam
}

module.exports = {
  mergeParams,
}
