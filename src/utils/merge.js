'use strict'

const { mergeAll } = require('lodash/fp')

const { isObject } = require('./types')

// Merge request parameters of same name and location
const mergeParams = function(params) {
  return params
    .filter(param => param !== undefined)
    .map(mergeParam)
    .filter(param => param !== undefined)
}

const mergeParam = function(param, index, params) {
  const nextSameParams = findSameParams({ params, param, start: index + 1 })

  if (nextSameParams.length !== 0) {
    return
  }

  const prevSameParams = findSameParams({ params, param, length: index })

  if (prevSameParams.length !== 0) {
    return deepMerge(...prevSameParams, param)
  }

  return param
}

const findSameParams = function({ params, param, start = 0, length }) {
  return params.slice(start, length).filter(paramB => isSameParam(param, paramB))
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

const deepMerge = function(...values) {
  const lastValue = values[values.length - 1]

  if (!isObject(lastValue)) {
    return lastValue
  }

  return mergeAll(values)
}

module.exports = {
  mergeParams,
  isSameParam,
  deepMerge,
}
