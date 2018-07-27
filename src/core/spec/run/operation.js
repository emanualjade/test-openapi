'use strict'

// Find the operation related to a specific task, and add it
// Does so by checking OpenAPI's `operationId` against either:
//  - `task.operation`
//  - task key which should be `operationId/...`
const getOperation = function({
  key,
  spec: { operation: taskOperationId, definition: { operations } } = {},
}) {
  const operationsA = operations.filter(({ operationId }) => operationId !== undefined)

  if (taskOperationId !== undefined) {
    return operationsA.find(({ operationId }) => operationId === taskOperationId)
  }

  return operationsA.find(({ operationId }) => key.startsWith(`${operationId}/`))
}

module.exports = {
  getOperation,
}
