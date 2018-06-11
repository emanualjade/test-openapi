'use strict'

const { mergeAll } = require('lodash/fp')

const { getSpecOperation } = require('./operation')
const { removeOptionals } = require('./optional')

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

  // Specification params have less priority than `task.random.*`
  const randomA = mergeAll([paramsA, random])
  return randomA
}

module.exports = {
  addSpecToRandom,
}
