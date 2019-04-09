import { pickBy, mapKeys } from 'lodash'

// Handle special dot notation `task['headers.NAME']`,
// `task['query.NAME']`, etc.
// Returned as object
export const removePrefixes = function(object, prefix) {
  const objectA = pickBy(object, (value, name) => name.startsWith(prefix))
  const objectB = mapKeys(objectA, (value, name) =>
    name.replace(`${prefix}.`, ''),
  )
  return objectB
}
