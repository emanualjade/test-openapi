'use strict'

// `test.request|response.*: invalid` means we inverse re-use parameter's schema
const mergeInvalidSchema = function({
  inputA,
  inputA: {
    schema,
    schema: { type },
  },
  inputB,
}) {
  const typeA = addNullType({ type })
  const schemaA = { ...schema, type: typeA }
  return { ...inputA, ...inputB, schema: { not: schemaA } }
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
