'use strict'

// `task.parameters|validate.*: invalid` means we inverse re-use parameter's schema
const isInvalidSchema = function({ schema }) {
  return (
    schema !== undefined &&
    Array.isArray(schema.enum) &&
    schema.enum.length === 1 &&
    schema.enum[0] === 'invalid'
  )
}

const mergeInvalidSchema = function({ specSchema }) {
  // If `invalid` but the specification does not define this property, ignore it
  if (specSchema === undefined) {
    return {}
  }

  const type = addNullType({ specSchema })
  return { not: { ...specSchema, type } }
}

// When using 'invalid', we want to make sure the value is generated, i.e. it
// should never be `null`
const addNullType = function({ specSchema: { type = [] } }) {
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
  isInvalidSchema,
  mergeInvalidSchema,
}
