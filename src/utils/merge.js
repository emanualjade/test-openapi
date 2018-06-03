'use strict'

const { mergeAll } = require('lodash/fp')

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
const mergeValues = function(array, condition, merge = shallowMerge) {
  return array
    .filter(value => value !== undefined)
    .map(mergeValue.bind(null, merge, condition))
    .filter(value => value !== undefined)
}

const mergeValue = function(merge, condition, value, index, array) {
  const nextSameValues = findSameValues({ condition, array, value, start: index + 1 })

  if (nextSameValues.length !== 0) {
    return
  }

  const prevSameValues = findSameValues({ condition, array, value, length: index })

  if (prevSameValues.length !== 0) {
    return merge(...prevSameValues, value)
  }

  return value
}

const findSameValues = function({ condition, array, value, start = 0, length }) {
  return array.slice(start, length).filter(valueB => condition(value, valueB))
}

const shallowMerge = function(...values) {
  return Object.assign({}, ...values)
}

const deepMerge = function(...values) {
  const lastValue = values[values.length - 1]

  if (!isObject(lastValue)) {
    return lastValue
  }

  return mergeAll(values)
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
