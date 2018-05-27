'use strict'

const { throwTaskError } = require('../../errors')
const { DEFAULT_STATUS_CODE } = require('../../constants')

// Find the operation related to a specific task, and add it
// Does so by checking task key which should be `OperationId.taskName`
const getOperation = function({ taskKey, validate, spec }) {
  const operation = findOperation({ taskKey, spec })
  const name = taskKey.replace(`${operation.operationId}.`, '')

  const response = findResponse({ operation, validate, taskKey })
  const operationA = { ...operation, response }

  return { name, operation: operationA }
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

// Find the operation's response related to a specific task, and add it
// Does so by checking `task.validate.status`
const findResponse = function({
  operation: { responses },
  validate: { status = DEFAULT_STATUS_CODE } = {},
  taskKey,
}) {
  const response = responses[String(status)]

  if (response !== undefined) {
    return response
  }

  const property = 'response.status'
  throwTaskError(
    `Task named '${taskKey}' cannot have 'response.status' ${status} because this status code is not present in the specification`,
    { task: taskKey, property },
  )
}

module.exports = {
  getOperation,
}
