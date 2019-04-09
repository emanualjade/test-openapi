import METHODS from 'methods'

// eslint-disable-next-line import/no-namespace
import * as config from './config_data'

const UPPERCASE_METHODS = METHODS.map(method => method.toUpperCase())

// Add all allowed HTTP methods to config validation
const validateHttpMethods = function({
  config: configA,
  config: {
    task,
    task: {
      properties,
      properties: { method },
    },
  },
}) {
  const methods = [...METHODS, ...UPPERCASE_METHODS]

  return {
    ...configA,
    task: {
      ...task,
      properties: { ...properties, method: { ...method, enum: methods } },
    },
  }
}

export const configB = validateHttpMethods({ config })
