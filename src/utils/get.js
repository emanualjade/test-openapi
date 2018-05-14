'use strict'

// Like Lodash get() except works with objects that have keys with dots in them
const get = function(obj, path) {
  if (!path.includes('.') || obj[path] !== undefined) {
    return obj[path]
  }

  const keyA = Object.keys(obj).find(key => path.startsWith(`${key}.`))
  if (keyA === undefined) {
    throw new Error(`Could not find key named '${path}'`)
  }

  const pathA = path.replace(`${keyA}.`, '')
  return get(obj[keyA], pathA)
}

module.exports = {
  get,
}
