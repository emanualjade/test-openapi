import { checkSchema } from '../validation/check.js'

// Validate configuration
export const validateConfig = function({ config }) {
  checkSchema({
    schema: CONFIG_SCHEMA,
    value: config,
    valueProp: 'config',
    message: 'configuration is invalid',
  })
}

const CONFIG_SCHEMA = {
  type: 'object',
  properties: {
    plugins: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    tasks: {
      type: 'array',
      items: {
        type: ['string', 'object'],
      },
    },
  },
}
