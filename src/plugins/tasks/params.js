'use strict'

// From `task.parameters.*` object to an array of `{ name, location, required, schema }`
const normalizeTasksParams = function({ tasks }) {
  return tasks.map(normalizeParams)
}

const normalizeParams = function({ parameters: params = {}, ...task }) {
  const paramsA = Object.entries(params).map(normalizeParam)
  return { ...task, params: paramsA }
}

const normalizeParam = function([key, schema]) {
  const { location, name } = parseLocation({ key })

  // Parameters specified in `task.parameters.*` are always required (i.e. generated)
  const param = { schema, required: true, location, name }
  return param
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
  normalizeTasksParams,
}
