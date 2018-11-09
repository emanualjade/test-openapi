'use strict'

const isMergeableObject = require('is-mergeable-object')

const { customMerge } = require('../utils')

const { isTemplate } = require('./parse')

// Deep merge that never merges templates deeply
const merge = function(...objects) {
  const filtered = objects.filter((obj) => {
    return obj != null
  })

  return customMerge(mergeWithTemplate, ...filtered)
}

const mergeWithTemplate = function(value) {
  return !isTemplate(value) && isMergeableObject(value)
}

module.exports = {
  merge,
}
