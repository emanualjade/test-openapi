const METHODS = require('methods')

const config = require('./config.json')

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

const configB = validateHttpMethods({ config })

module.exports = {
  config: configB,
}
