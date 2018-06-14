'use strict'

const { mapKeys } = require('lodash')
const { capitalize } = require('underscore.string')

// Add `originalTask.*` to `errorProps`
const addOriginalProps = function({ errorProps, originalTask }) {
  const originalProps = getOriginalProps({ originalTask })
  // Merged with lower priority, but should appear at end
  return [...errorProps, originalProps, ...errorProps]
}

const getOriginalProps = function({ originalTask }) {
  return mapKeys(originalTask, normalizeOriginalTaskKey)
}

const normalizeOriginalTaskKey = function(value, name) {
  return capitalize(name)
}

module.exports = {
  addOriginalProps,
}
