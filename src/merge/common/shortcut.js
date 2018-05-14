'use strict'

// `test.request|response.*: non-object` is shortcut for `{ enum: [value] }`
const mergeShortcutSchema = function({ specSchema, testSchema }) {
  const type = getSchemaType({ testSchema })
  const schema = { ...specSchema, type, enum: [testSchema] }
  return schema
}

// When using the shortcut notation, we need to set the `type` to make sure it
// matches the value (in case it is not set, or set to several types, or set to
// a different type)
const getSchemaType = function({ testSchema }) {
  if (testSchema === null) {
    return 'null'
  }

  if (Number.isInteger(testSchema)) {
    return 'integer'
  }

  if (['string', 'number', 'boolean'].includes(typeof testSchema)) {
    return typeof testSchema
  }

  if (Array.isArray(testSchema)) {
    return 'array'
  }
}

module.exports = {
  mergeShortcutSchema,
}
