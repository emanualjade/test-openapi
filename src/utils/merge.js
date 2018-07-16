'use strict'

const { mergeWith } = require('lodash')

// Slight variation on Lodash `_.merge()`
const merge = function(...objects) {
  return mergeWith({}, ...objects, shallowMergeArray)
}

const shallowMergeArray = function(dest, src) {
  if (Array.isArray(dest)) {
    return src
  }
}

module.exports = {
  merge,
}
