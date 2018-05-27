'use strict'

// Use dot notation for `task.parameters.*`, e.g. `task.parameters['query.VAR']`
// to indicate both `location` and `name`
const keyToLocation = function({ key }) {
  if (SINGLE_NAME_LOCATIONS.includes(key)) {
    return { location: key, name: key }
  }

  const [location, ...name] = key.split('.')
  const nameA = name.join('.')

  return { location, name: nameA }
}

const locationToKey = function({ location, name }) {
  if (SINGLE_NAME_LOCATIONS.includes(location)) {
    return location
  }

  return `${location}.${name}`
}

const locationToValue = function({ location, name, value }) {
  if (SINGLE_NAME_LOCATIONS.includes(location)) {
    return { [location]: value }
  }

  return { [location]: { [name]: value } }
}

// Those locations do not use dot notations
const SINGLE_NAME_LOCATIONS = ['method', 'server', 'path', 'body']

module.exports = {
  keyToLocation,
  locationToKey,
  locationToValue,
}
