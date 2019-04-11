import isMergeableObject from 'is-mergeable-object'

import { customMerge } from '../utils/merge.js'

import { isTemplate } from './parse.js'

// Deep merge that never merges templates deeply
export const mergeWithTemplates = function(...objects) {
  return customMerge(mergeWithTemplate, ...objects)
}

const mergeWithTemplate = function(value) {
  return !isTemplate(value) && isMergeableObject(value)
}
