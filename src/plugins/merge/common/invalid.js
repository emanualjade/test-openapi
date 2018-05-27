'use strict'

// `task.parameters|validate.*: invalid` means we inverse re-use parameter's schema
const mergeInvalidSchema = function({ specSchema, specSchema: { type } }) {
  const typeA = addNullType({ type })
  const schema = { not: { ...specSchema, type: typeA } }
  return schema
}

// When using 'invalid', we want to make sure the value is generated, i.e. it
// should never be `null`
const addNullType = function({ type = [] }) {
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
  mergeInvalidSchema,
}
