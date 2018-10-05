'use strict'

const { pickBy, mapKeys } = require('lodash')

// Handle special dot notation `task['headers.NAME']`, `task['query.NAME']`, etc.
// Returned as object
const removePrefixes = function(object, prefix) {
  const objectA = pickBy(object, (value, name) => name.startsWith(prefix))
  const objectB = mapKeys(objectA, (value, name) =>
    name.replace(`${prefix}.`, ''),
  )
  return objectB
}

module.exports = {
  removePrefixes,
}
