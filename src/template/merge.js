'use strict'

const { customMerge } = require('../utils')

const { isTemplate } = require('./parse')

// Variation on Lodash `_.merge()` that never merges templates deeply
const merge = function(...objects) {
  return customMerge(mergeWithTemplate, ...objects)
}

const mergeWithTemplate = function(src, dest) {
  if (isTemplate(src) || isTemplate(dest)) {
    return dest
  }
}

module.exports = {
  merge,
}
