'use strict'

const { mergeTaskParams } = require('./common')

// Merge HTTP request parameters to specification
const mergeParams = function({ params, operation }) {
  const taskParams = getTaskParams({ params })

  const paramsA = mergeTaskParams([...operation.params, ...taskParams])

  return paramsA
}

// Translate `task.parameters` into request parameters
const getTaskParams = function({ params = {} }) {
  return Object.entries(params).map(getTaskParam)
}

const getTaskParam = function([key, schema]) {
  const { location, name } = parseLocation({ key })

  // Parameters specified in `task.parameters.*` are always required (i.e. generated)
  const taskParam = { schema, required: true, location, name }
  return taskParam
}

// Use dot notation for `task.parameters.*`, e.g. `task.parameters['query.VAR']`
// to indicate both `location` and `name`
const parseLocation = function({ key }) {
  if (key === 'body') {
    return { location: 'body', name: 'body' }
  }

  const [location, ...name] = key.split('.')
  const nameA = name.join('.')

  return { location, name: nameA }
}

module.exports = {
  mergeParams,
}
