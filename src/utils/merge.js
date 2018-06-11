'use strict'

const { mergeAll } = require('lodash/fp')

const { isObject } = require('./types')

// Merge request parameters of same name and location
const mergeCall = function(...params) {
  return deepMerge(...params)
}

const deepMerge = function(...values) {
  const lastValue = values[values.length - 1]

  if (!isObject(lastValue)) {
    return lastValue
  }

  return mergeAll(values)
}

module.exports = {
  mergeCall,
  deepMerge,
}
