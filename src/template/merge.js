'use strict'

const isMergeableObject = require('is-mergeable-object')

const { customMerge } = require('../utils')

const { isTemplate } = require('./parse')

// Deep merge that never merges templates deeply
const merge = function(...objects) {
  return customMerge(mergeWithTemplate, ...objects)
}

const mergeWithTemplate = function(value) {
  return !isTemplate(value) && isMergeableObject(value)
}

module.exports = {
  merge,
}
