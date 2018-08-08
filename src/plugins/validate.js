'use strict'

const { checkIsSchema } = require('../validation')

// Validate export value `config` are JSON schemas
const validateJsonSchemas = function({ plugin: { name, config = {} } }) {
  Object.entries(config).forEach(([propName, schema]) =>
    validateJsonSchema({ schema, name, propName }),
  )
}

const validateJsonSchema = function({ schema, name, propName }) {
  checkIsSchema({
    value: schema,
    name: `plugin.config.${propName}`,
    props: { module: `plugin-${name}` },
    bug: true,
  })
}

module.exports = {
  validateJsonSchemas,
}
