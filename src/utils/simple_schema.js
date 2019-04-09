const { isObject } = require('./types')

// Check if JSON schema is a constant, i.e. `{ enum: [value] }`
const isSimpleSchema = function(schema) {
  return (
    isObject(schema) && Array.isArray(schema.enum) && schema.enum.length === 1
  )
}

const getSimpleSchemaConstant = function(schema) {
  return schema.enum[0]
}

module.exports = {
  isSimpleSchema,
  getSimpleSchemaConstant,
}
