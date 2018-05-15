'use strict'

const { LOCATION_TO_KEY } = require('../constants')

// Return normalized request value
// It is used by `deps` and error objects
const getNormRequest = function({ request }) {
  const normRequest = request.map(getNormParam)
  const normRequestA = Object.assign({}, ...normRequest)
  return normRequestA
}

const getNormParam = function({ name, location, value }) {
  const key = getNormParamKey({ name, location })
  return { [key]: value }
}

const getNormParamKey = function({ name, location }) {
  if (location === 'body') {
    return 'body'
  }

  return `${LOCATION_TO_KEY[location]}.${name}`
}

module.exports = {
  getNormRequest,
}
