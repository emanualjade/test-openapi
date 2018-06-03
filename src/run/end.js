'use strict'

const { runHandlers } = require('../plugins')
const { addErrorHandler } = require('../errors')

// Run `end` handlers
const endTasks = async function({ tasks, plugins, config }) {
  const events = []
  const { events: eventsA } = await runHandlers({ events }, plugins, 'end', { tasks, config })
  return eventsA
}

// If an `end` handle throws, it becomes a `{ type: 'error', error }` event
const endTasksHandler = function(error) {
  return { type: 'error', error }
}

const eEndTasks = addErrorHandler(endTasks, endTasksHandler)

module.exports = {
  endTasks: eEndTasks,
}
