'use strict'

const { getOperation } = require('./operation')
const { addSpecToCall } = require('./call')
const { addSpecToValidate } = require('./validate')

// Add OpenAPI specification to `task.call|validate.*`
// According to `task.spec.definition` and `task.spec.operation`
const run = function(
  { key, call, validate, spec },
  { pluginNames, startData },
) {
  const operation = getOperation({ key, spec, startData })

  // Task `operationId` was not found, or there is no OpenAPI definition
  if (operation === undefined) {
    return
  }

  const callA = addSpecToCall({ call, operation })

  const validateA = addSpecToValidate({ validate, pluginNames, operation })

  return { call: callA, validate: validateA }
}

module.exports = {
  run,
}
