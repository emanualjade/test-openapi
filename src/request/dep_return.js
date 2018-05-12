'use strict'

const { LOCATION_TO_KEY } = require('../constants')

// Return value if this test was a `dep`
const getDepReturn = function({ request }) {
  const depReturn = request.map(getDepReturnParam)
  const depReturnA = Object.assign({}, ...depReturn)
  return depReturnA
}

const getDepReturnParam = function({ name, location, value }) {
  const key = getDepReturnKey({ name, location })
  return { [key]: value }
}

const getDepReturnKey = function({ name, location }) {
  if (location === 'body') {
    return 'body'
  }

  return `${LOCATION_TO_KEY[location]}.${name}`
}

module.exports = {
  getDepReturn,
}
