'use strict'

const { isDeepStrictEqual } = require('util')

const { merge } = require('lodash')

const { isObject } = require('./types')

// Merge request parameters of same name and location
const mergeParams = function(params, merge) {
  return mergeValues(params, isSameParam, merge)
}

// Merge headers of same name
const mergeHeaders = function(headers, merge) {
  return mergeValues(headers, isSameHeader, merge)
}

// Merge array values with a custom merge function and condition function
const mergeValues = function(array, condition = isDeepStrictEqual, merge = defaultMerge) {
  return array
    .filter(value => value !== undefined)
    .map(mergeValue.bind(null, merge, condition))
    .filter(value => value !== undefined)
}

const mergeValue = function(merge, condition, value, index, array) {
  const nextSameValue = findSameValue({ condition, array, value, start: index + 1 })

  if (nextSameValue !== undefined) {
    return
  }

  const prevSameValue = findSameValue({ condition, array, value, length: index })

  if (prevSameValue !== undefined) {
    return merge(prevSameValue, value)
  }

  return value
}

const findSameValue = function({ condition, array, value, start = 0, length }) {
  return array.slice(start, length).find(valueB => condition(value, valueB))
}

const defaultMerge = function(valueA, valueB) {
  return { ...valueA, ...valueB }
}

const deepMerge = function(valueA, valueB) {
  if (!isObject(valueA) || !isObject(valueB)) {
    return valueB
  }

  return merge({}, valueA, valueB)
}

const isSameParam = function(paramA, paramB) {
  if (paramA.location !== paramB.location) {
    return false
  }

  if (paramA.location === 'headers') {
    return paramA.name.toLowerCase() === paramB.name.toLowerCase()
  }

  return paramA.name === paramB.name
}

const isSameHeader = function(inputA, inputB) {
  return inputA.name.toLowerCase() === inputB.name.toLowerCase()
}

module.exports = {
  mergeParams,
  mergeHeaders,
  deepMerge,
}
