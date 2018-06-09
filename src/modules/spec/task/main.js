'use strict'

const { addSpecToRandom } = require('./random')
const { addSpecToValidate } = require('./validate')

// Add OpenAPI specification to `task.random|validate.*`
const addSpecToTask = function({ config: { spec }, key, call, validate, pluginNames }) {
  const callA = addSpecToRandom({ spec, key, call, pluginNames })
  const validateA = addSpecToValidate({ spec, key, validate, pluginNames })
  return { call: callA, validate: validateA }
}

module.exports = {
  addSpecToTask,
}
