'use strict'

const { omit, omitBy, mapValues } = require('lodash')

// Spec parameters with 'x-random: optional' are only kept when merged with another
// 'task.call|random.*' parameter.
// This also means using an empty object in `task.call|random.*` allows re-using
// spec parameters.
const removeOptionals = function({ params, random, call }) {
  const paramsA = omitBy(params, (param, key) => isSkippedOptional({ param, key, random, call }))
  const paramsB = mapValues(paramsA, removeRequired)
  return paramsB
}

const isSkippedOptional = function({ param: { 'x-required': required }, key, random, call }) {
  return !required && call[key] === undefined && random[key] === undefined
}

// Remove `x-required` now that it's been used
const removeRequired = function(param) {
  return omit(param, 'x-required')
}

module.exports = {
  removeOptionals,
}
