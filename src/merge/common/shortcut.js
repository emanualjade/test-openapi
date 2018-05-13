'use strict'

// `test.request|response.*: non-object` is shortcut for `{ enum: [value] }`
const mergeShortcutSchema = function({ inputA, inputB }) {
  const type = getSchemaType({ value: inputB.schema })
  return { ...inputA, ...inputB, schema: { ...inputA.schema, type, enum: [inputB.schema] } }
}

// When using the shortcut notation, we need to set the `type` to make sure it
// matches the value (in case it is not set, or set to several types, or set to
// a different type)
const getSchemaType = function({ value }) {
  if (value === null) {
    return 'null'
  }

  if (typeof value === 'string') {
    return 'string'
  }

  if (Number.isInteger(value)) {
    return 'integer'
  }

  if (typeof value === 'number') {
    return 'number'
  }

  if (Array.isArray(value)) {
    return 'array'
  }
}

module.exports = {
  mergeShortcutSchema,
}
