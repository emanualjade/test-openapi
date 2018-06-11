'use strict'

const { addSpecToRandom } = require('./random')
const { addSpecToValidate } = require('./validate')

// Add OpenAPI specification to `task.random|validate.*`
const addSpecToTask = function({ config: { spec }, key, random, call, validate }) {
  const randomA = addSpecToRandom({ spec, key, random, call })
  const validateA = addSpecToValidate({ spec, key, validate })
  return { random: randomA, validate: validateA }
}

module.exports = {
  addSpecToTask,
}
