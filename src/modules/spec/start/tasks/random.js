'use strict'

const { getSpecOperation } = require('./operation')

// Add OpenAPI specification parameters to `task.call.*`
const addSpecToRandom = function({
  spec,
  task,
  task: {
    call: { params, ...call },
    key,
  },
  pluginNames,
}) {
  // Optional dependency
  if (!pluginNames.includes('random')) {
    return task
  }

  const specOperation = getSpecOperation({ key, spec })

  // Task does not start with an `operationId`
  if (specOperation === undefined) {
    return task
  }

  // Specification params have less priority than `task.call|random.*`
  const paramsA = [...specOperation.params, ...params]

  return { ...task, call: { ...call, params: paramsA } }
}

module.exports = {
  addSpecToRandom,
}
