'use strict'

const { keyToLocation } = require('../../utils')

// From `task.parameters.*` object to an array of `{ name, location, required, schema }`
const normalizeTasksParams = function({ tasks }) {
  return tasks.map(normalizeParams)
}

const normalizeParams = function({ parameters: params = {}, ...task }) {
  const paramsA = Object.entries(params).map(normalizeParam)
  return { ...task, params: paramsA }
}

const normalizeParam = function([key, schema]) {
  const { location, name } = keyToLocation({ key })

  // Parameters specified in `task.parameters.*` are always required (i.e. generated)
  const param = { schema, required: true, location, name }
  return param
}

module.exports = {
  normalizeTasksParams,
}
