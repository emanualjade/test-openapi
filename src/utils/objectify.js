'use strict'

// From an array of parameters to { `path.*`: ..., `body`: ..., `headers.*`: ... }
const objectifyParams = function({ params }) {
  const paramsA = params.map(mapLocationToKey)
  const request = Object.assign({}, ...paramsA)
  return request
}

const mapLocationToKey = function({ name, value, location }) {
  const key = locationToKey({ location, name })
  return { [key]: value }
}

// From `{ status, headers, body }` to `{ status, 'headers.*': ..., body }`
const objectifyResponse = function({ response: { status, headers, body } }) {
  const headersA = getRawHeaders({ headers })
  const rawResponse = { status, ...headersA, body }
  return rawResponse
}

const getRawHeaders = function({ headers }) {
  const headersA = Object.entries(headers).map(mapHeaders)
  const headersB = Object.assign({}, ...headersA)
  return headersB
}

const mapHeaders = function([name, value]) {
  return { [`headers.${name}`]: value }
}

// From a parameter `name` and `location` to an object key
const locationToKey = function({ name, location }) {
  if (location === 'body') {
    return 'body'
  }

  return `${LOCATION_TO_KEY[location]}.${name}`
}

const LOCATION_TO_KEY = {
  path: 'path',
  query: 'query',
  header: 'headers',
  body: 'body',
  formData: 'body',
}

// Use dot notation for `task.parameters.*`, e.g. `task.parameters['query.VAR']`
// to indicate both `location` and `name`
const keyToLocation = function({ key }) {
  if (key === 'body') {
    return { location: 'body', name: 'body' }
  }

  const [type, ...name] = key.split('.')
  const nameA = name.join('.')

  const location = KEY_TO_LOCATION[type]

  return { location, name: nameA }
}

const KEY_TO_LOCATION = {
  path: 'path',
  query: 'query',
  headers: 'header',
  body: 'formData',
}

module.exports = {
  objectifyParams,
  objectifyResponse,
  keyToLocation,
}
