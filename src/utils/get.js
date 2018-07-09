'use strict'

// Like Lodash.get() except takes into account objects whose properties have dots
// E.g. _.get({ a: { 'b.c': true } }, 'a.b.c') does not work
const get = function(value, path) {
  const pathA = path.replace(BRACKETS_REGEXP, '.$1')
  return getProperty(value, pathA)
}

// Allow array bracket notations `[integer]`
const BRACKETS_REGEXP = /\[([\d]+)\]/g

const getProperty = function(value, path) {
  // We can only follow `path` within objects and arrays
  if (typeof value !== 'object' || value === null) {
    return
  }

  // When we reached the final property
  if (value.propertyIsEnumerable(path)) {
    return value[path]
  }

  // Find the next property
  const property = Object.keys(value)
    .filter(key => path.startsWith(`${key}.`))
    .reduce(getLargestString, '')

  // When `path` does not match anything in `value`
  if (property === '') {
    return
  }

  // Recursion
  const child = value[property]
  const childPath = path.replace(`${property}.`, '')
  return getProperty(child, childPath)
}

// If several keys match, take the largest one
const getLargestString = function(memo, string) {
  if (string.length >= memo.length) {
    return string
  }

  return memo
}

module.exports = {
  get,
}
