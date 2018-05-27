'use strict'

const { throwTaskError } = require('../../../errors')

// Find the operation related to a specific task, and add it
// Does so by checking task key which should be `OperationId.taskName`
const getOperation = function({ taskKey, spec: { operations } }) {
  const operation = operations.find(
    ({ operationId }) => operationId && taskKey.startsWith(`${operationId}.`),
  )
  if (operation !== undefined) {
    return operation
  }

  throwTaskError(`Task named '${taskKey}' does not match any operation in the specification`, {
    task: taskKey,
  })
}

module.exports = {
  getOperation,
}
