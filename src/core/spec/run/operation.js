'use strict'

// Find the operation related to a specific task, and add it
// Does so by checking OpenAPI's `operationId` against either:
//  - `task.operation`
//  - task key which should be `operationId ...`
const getOperation = function({
  key,
  spec: { operation: taskOperationId } = {},
  startData: {
    spec: { [key]: definition },
  },
}) {
  if (definition === undefined) {
    return
  }

  const operations = definition.operations.filter(({ operationId }) => operationId !== undefined)

  if (taskOperationId !== undefined) {
    return operations.find(({ operationId }) => operationId === taskOperationId)
  }

  return operations.find(({ operationId }) => key.startsWith(`${operationId} `))
}

module.exports = {
  getOperation,
}
