'use strict'

const { mergeWith } = require('lodash')

// Slight variation on Lodash `_.merge()`
const merge = function(...objects) {
  return mergeWith({}, ...objects, shallowMergeArray)
}

// Allow customizing merge by adding a `func`
const customMerge = function(func, ...objects) {
  return mergeWith({}, ...objects, customMergeValue.bind(null, func))
}

const customMergeValue = function(func, src, dest) {
  if (Array.isArray(src)) {
    return dest
  }

  return func(src, dest)
}

const shallowMergeArray = function(src, dest) {
  if (Array.isArray(src)) {
    return dest
  }
}

module.exports = {
  merge,
  customMerge,
}
