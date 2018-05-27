'use strict'

// `task.parameters|validate.*: invalid` means we inverse re-use parameter's schema
const isInvalidValue = function({ value }) {
  return (
    value !== undefined &&
    Array.isArray(value.enum) &&
    value.enum.length === 1 &&
    value.enum[0] === 'invalid'
  )
}

const mergeInvalidValue = function({ specValue }) {
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
  isInvalidValue,
  mergeInvalidValue,
}
