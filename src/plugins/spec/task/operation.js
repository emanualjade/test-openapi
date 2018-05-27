'use strict'

// Find the operation related to a specific task, and add it
// Does so by checking task key which should be `OperationId.taskKey`
const getSpecOperation = function({ taskKey, config: { spec } }) {
  if (spec === undefined) {
    return
  }

  return spec.operations.find(
    ({ operationId }) => operationId && taskKey.startsWith(`${operationId}.`),
  )
}

// Find the specification response matching both the current operation and
// the received status code
const getSpecResponse = function({ taskKey, config, rawResponse: { status } }) {
  const operation = getSpecOperation({ taskKey, config })
  if (operation === undefined) {
    return
  }

  const { responses } = operation
  const specResponse = responses[String(status)] || responses.default
  return specResponse
}

module.exports = {
  getSpecOperation,
  getSpecResponse,
}
