'use strict'

const { getSpecOperation } = require('./operation')

// Add OpenAPI specification parameters to `task.call.*`
const addSpecToRandom = function({ spec, key, call, call: { params }, pluginNames }) {
  // Optional dependency
  if (!pluginNames.includes('random')) {
    return call
  }

  const specOperation = getSpecOperation({ key, spec })

  // Task does not start with an `operationId`
  if (specOperation === undefined) {
    return call
  }

  // Specification params have less priority than `task.call|random.*`
  const paramsA = [...specOperation.params, ...params]

  return { ...call, params: paramsA }
}

module.exports = {
  addSpecToRandom,
}
