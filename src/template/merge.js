'use strict'

const { customMerge } = require('../utils')

const { isHelper } = require('./parse')

// Variation on Lodash `_.merge()` that never merges helpers deeply
const merge = function(...objects) {
  return customMerge(mergeWithHelpers, ...objects)
}

const mergeWithHelpers = function(src, dest) {
  if (isHelper(src) || isHelper(dest)) {
    return dest
  }
}

module.exports = {
  merge,
}
