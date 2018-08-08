'use strict'

const { TestOpenApiError } = require('./error')

// If any task failed, throw an error
const handleFinalFailure = function({ tasks }) {
  const errors = getFinalErrors({ tasks })
  if (errors.length === 0) {
    return
  }

  // Bundle several errors into one
  throw new TestOpenApiError('Some tasks failed', { tasks, errors })
}

const getFinalErrors = function({ tasks }) {
  return tasks.filter(({ error }) => error !== undefined).map(({ error }) => error)
}

module.exports = {
  handleFinalFailure,
}
