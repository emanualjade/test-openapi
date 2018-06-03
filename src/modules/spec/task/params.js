'use strict'

const { getSpecOperation } = require('./operation')

// Add OpenAPI specification parameters to `task.call.*`
const addSpecParams = function({ call: { params, ...call }, key, config, pluginNames }) {
  // Optional dependency
  if (!pluginNames.includes('random')) {
    return
  }

  const specOperation = getSpecOperation({ key, config })
  // Task does not start with an `operationId`
  if (specOperation === undefined) {
    return
  }

  // Specification params have less priority than `task.call|random.*`
  const paramsA = [...specOperation.params, ...params]

  return { call: { ...call, params: paramsA } }
}

module.exports = {
  addSpecParams,
}
