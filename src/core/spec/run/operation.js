'use strict'

// Find the operation related to a specific task, and add it
// Does so by checking task key which should be `OperationId/key`
const getOperation = function({
  key,
  startData: {
    spec: { operations },
  },
}) {
  return operations.find(({ operationId }) => operationId && key.startsWith(`${operationId}/`))
}

module.exports = {
  getOperation,
}
