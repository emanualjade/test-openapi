'use strict'

const { mergeCall } = require('../../../utils')

const { getSpecOperation } = require('./operation')
const { removeOptionals } = require('./optional')
// const { fixRequireds } = require('./required')

// Add OpenAPI specification parameters to `task.random.*`
const addSpecToRandom = function({ spec, key, random, call, pluginNames }) {
  // Optional dependency
  if (!pluginNames.includes('random')) {
    return random
  }

  const specOperation = getSpecOperation({ key, spec })

  // Task does not start with an `operationId`
  if (specOperation === undefined) {
    return random
  }

  const { params } = specOperation
  const paramsA = removeOptionals({ params, random, call })

  // const paramsB = fixRequireds({ params: paramsA, random, call })

  // Specification params have less priority than `task.random.*`
  const randomA = mergeCall(paramsA, random)
  return randomA
}

module.exports = {
  addSpecToRandom,
}
