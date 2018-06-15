'use strict'

const { bundleErrors } = require('./bundle')

// If any task failed, throw an error
const handleFinalFailure = function({ tasks }) {
  const errors = getFinalErrors({ tasks })
  if (errors.length === 0) {
    return
  }

  const error = bundleErrors({ errors })

  Object.assign(error, ERROR_PROPS, { tasks })

  throw error
}

const getFinalErrors = function({ tasks }) {
  return tasks.filter(({ error }) => error !== undefined).map(({ error }) => error)
}

const ERROR_PROPS = {
  message: 'Some tasks failed',
  plugin: 'task',
}

module.exports = {
  handleFinalFailure,
}
