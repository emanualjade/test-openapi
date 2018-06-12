'use strict'

const { addSpecToRandom } = require('./random')
const { addSpecToValidate } = require('./validate')

// Add OpenAPI specification to `task.random|validate.*`
const task = function({ config: { spec }, key, random, call, validate, plugins }) {
  const randomA = addSpecToRandom({ spec, key, random, call, plugins })
  const validateA = addSpecToValidate({ spec, key, validate, plugins })
  return { random: randomA, validate: validateA }
}

module.exports = {
  task,
}
