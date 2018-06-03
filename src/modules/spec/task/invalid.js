'use strict'

const { isObject } = require('../../../utils')

// `invalid` values are `{ format: 'invalid' }` JSON schemas
const isInvalidFormat = function({ isRandom, value }) {
  return isRandom && isObject(value) && value.format === 'invalid'
}

// Merge `task.random.*: { format: 'invalid' }`
// I.e. inverse the specification schema
const mergeInvalidFormat = function({ specValue }) {
  // If `invalid` but the specification does not define this property, ignore it
  if (specValue === undefined) {
    return {}
  }

  const type = addNullType({ specValue })
  return { not: { ...specValue, type } }
}

// When using 'invalid', we want to make sure the value is generated, i.e. it
// should never be `null`
const addNullType = function({ specValue: { type = [] } }) {
  if (type === 'null') {
    return type
  }

  if (!Array.isArray(type)) {
    return ['null', type]
  }

  if (type.includes('null')) {
    return type
  }

  return ['null', ...type]
}

module.exports = {
  isInvalidFormat,
  mergeInvalidFormat,
}
