// Find the operation related to a specific task, and add it
// Does so by checking OpenAPI's `operationId` against `task.spec.operation`
export const getOperation = function({
  key,
  spec: { operation: taskOperationId } = {},
  startData: {
    spec: { [key]: { operations } = {} },
  },
}) {
  if (operations === undefined || taskOperationId === undefined) {
    return
  }

  const operation = operations.find(
    ({ operationId }) => operationId === taskOperationId,
  )
  return operation
}
