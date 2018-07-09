'use strict'

const { addSpecToCall } = require('./call')
const { addSpecToValidate } = require('./validate')

// Add OpenAPI specification to `task.call|validate.*`
const run = function({ key, call, validate }, { pluginNames, config: { spec }, helpers }) {
  const callA = addSpecToCall({ spec, key, call, helpers })
  const validateA = addSpecToValidate({ spec, key, validate, pluginNames })
  return { call: callA, validate: validateA }
}

module.exports = {
  run,
}
