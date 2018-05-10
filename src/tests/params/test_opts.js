'use strict'

// Translate `test.request` into requests parameters
const getTestParams = function({ testOpts: { request: testParams = {} } }) {
  return Object.entries(testParams).map(getTestParam)
}

const getTestParam = function([name, schema]) {
  const location = getLocation({ name })

  const testParam = { schema, ...location }
  return testParam
}

// Use dot notation for `test.request.*`, e.g. `test.request['query.VAR']`
// to indicate both `location` and `name`
const getLocation = function({ name }) {
  const [type, ...nameA] = name.split('.')

  // When no dot notation was used, e.g. `test.request.body`
  if (nameA.length === 0) {
    return { location: type, name }
  }

  const location = LOCATIONS[type]
  const nameB = nameA.join('.')
  return { location, name: nameB }
}

// Map from `test.request.LOCATION` to OpenAPI parameter `location`
const LOCATIONS = {
  path: 'path',
  query: 'query',
  // `test.request.headers.NAME` is a `header` parameter
  headers: 'header',
  // `test.request.body` is a `body` parameter
  // `test.request.body.NAME` is a `formData` parameter
  body: 'formData',
  security: 'security',
}

module.exports = {
  getTestParams,
}
