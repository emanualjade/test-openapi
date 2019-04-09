import isMergeableObject from 'is-mergeable-object'

import { customMerge } from '../utils.js'

import { isTemplate } from './parse.js'

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
