'use strict'

const { throwTaskError } = require('../../errors')

// Find the operation related to a specific task, and add it
// Does so by checking task key which should be `OperationId.taskName`
const getOperation = function({ taskKey, spec }) {
  const operation = findOperation({ taskKey, spec })
  const name = taskKey.replace(`${operation.operationId}.`, '')
  return { name, operation }
}

const findOperation = function({ taskKey, spec: { operations } }) {
  const operation = operations
    .filter(({ operationId }) => operationId)
    .find(({ operationId }) => taskKey.startsWith(`${operationId}.`))
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
