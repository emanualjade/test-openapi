import { checkSchema } from '../validation.js'

import CONFIG_SCHEMA from './schema.js'

// Validate configuration
const validateConfig = function({ config }) {
  checkSchema({
    schema: CONFIG_SCHEMA,
    value: config,
    valueProp: 'config',
    message: 'configuration is invalid',
  })
}

module.exports = {
  validateConfig,
}
