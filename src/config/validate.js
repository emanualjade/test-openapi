import { checkSchema } from '../validation.js'

import CONFIG_SCHEMA from './schema.js'

// Validate configuration
export const validateConfig = function({ config }) {
  checkSchema({
    schema: CONFIG_SCHEMA,
    value: config,
    valueProp: 'config',
    message: 'configuration is invalid',
  })
}
