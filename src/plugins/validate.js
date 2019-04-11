import { getPath } from '../utils/path.js'
import { checkIsSchema } from '../validation/meta.js'

// Validate export value `config` are JSON schemas
export const validateJsonSchemas = function({ plugin: { name, config = {} } }) {
  Object.entries(config).forEach(([propName, schema]) =>
    validateJsonSchema({ schema, name, propName }),
  )
}

const validateJsonSchema = function({ schema, name, propName }) {
  const valueProp = getPath(['plugin', 'config', propName])

  checkIsSchema({
    value: schema,
    valueProp,
    props: { module: `plugin-${name}` },
    bug: true,
  })
}
