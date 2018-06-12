'use strict'

const { bundleErrors } = require('../errors')

// The top-level command either:
//  - throws error with `error.errors` if any task failed
//  - returns all tasks as an array of `{ type: 'task', ...task }`
const getFinalReturn = function({ tasks, events }) {
  handleFinalFailure({ tasks, events })

  const eventsA = getEvents({ tasks, events })
  return eventsA
}

// If any task failed or any 'error' event was added, throw an error
const handleFinalFailure = function({ tasks, events }) {
  const errors = getFinalErrors({ tasks, events })
  if (errors.length === 0) {
    return
  }

  const error = bundleErrors({ errors })

  Object.assign(error, ERROR_PROPS)

  throw error
}

const getFinalErrors = function({ tasks, events }) {
  const taskErrors = tasks.filter(({ error }) => error !== undefined)
  const errorEvents = events.filter(({ type }) => type === 'error')
  const errors = [...taskErrors, ...errorEvents]
  const errorsA = errors.map(({ error }) => error)
  return errorsA
}

const ERROR_PROPS = {
  message: 'Some tasks failed',
  plugin: 'task',
}

// Transform to an event objects
const getEvents = function({ tasks, events }) {
  const taskEvents = tasks.map(task => ({ type: 'task', ...task }))
  return [...taskEvents, ...events]
}

module.exports = {
  getFinalReturn,
}
