'use strict'

const { addSpecToRandom } = require('./random')
const { addSpecToValidate } = require('./validate')

// Add OpenAPI specification to `task.random|validate.*`
const addSpecToTask = function({ config: { spec }, key, random, call, validate, pluginNames }) {
  const randomA = addSpecToRandom({ spec, key, random, call, pluginNames })
  const validateA = addSpecToValidate({ spec, key, validate, pluginNames })
  return { random: randomA, validate: validateA }
}

module.exports = {
  addSpecToTask,
}
