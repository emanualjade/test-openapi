import { checkSchema } from '../validation.js'

// eslint-disable-next-line import/no-namespace
import * as CONFIG_SCHEMA from './schema'

// Validate configuration
export const validateConfig = function({ config }) {
  checkSchema({
    schema: CONFIG_SCHEMA,
    value: config,
    valueProp: 'config',
    message: 'configuration is invalid',
  })
}
