'use strict'

const { LOCATION_TO_KEY } = require('./constants')

// Return normalized request value
// It is used by `deps` and error objects
const normalizeRequest = function({ request }) {
  const normRequest = request.map(normalizeParam)
  const normRequestA = Object.assign({}, ...normRequest)
  return normRequestA
}

const normalizeParam = function({ name, location, value }) {
  const key = normalizeParamKey({ name, location })
  return { [key]: value }
}

const normalizeParamKey = function({ name, location }) {
  if (location === 'body') {
    return 'body'
  }

  return `${LOCATION_TO_KEY[location]}.${name}`
}

module.exports = {
  normalizeRequest,
}
