'use strict'

const { KEY_TO_LOCATION } = require('../constants')

const { mergeTestRequest } = require('./common')
const { validateTestParam } = require('./validate')

// Merge HTTP request parameters to specification
const mergeRequest = function({
  test: {
    testOpts: { request = {} },
    operation: { parameters },
  },
}) {
  const testRequest = getTestRequest({ request, parameters })

  const requestA = mergeTestRequest([...parameters, ...testRequest])

  return requestA
}

// Translate `test.request` into requests parameters
const getTestRequest = function({ request, parameters }) {
  return Object.entries(request).map(([name, schema]) => getTestParam({ name, schema, parameters }))
}

const getTestParam = function({ name, schema, parameters }) {
  const location = getLocation({ name })

  // Parameters specified in `test.request.*` are always required (i.e. generated)
  const testParam = { schema, required: true, ...location }

  validateTestParam({ testParam, parameters, name })

  return testParam
}

// Use dot notation for `test.request.*`, e.g. `test.request['query.VAR']`
// to indicate both `location` and `name`
const getLocation = function({ name }) {
  if (name === 'body') {
    return { location: 'body', name: 'body' }
  }

  const [type, ...nameA] = name.split('.')
  const nameB = nameA.join('.')

  const location = KEY_TO_LOCATION[type]

  return { location, name: nameB }
}

module.exports = {
  mergeRequest,
}
