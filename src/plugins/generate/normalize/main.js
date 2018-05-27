'use strict'

const { normalizeTasksShortcuts } = require('./shortcut')
const { validateParamsJsonSchemas } = require('./validate')

const normalizeTasksGenerate = function({ tasks }) {
  const tasksA = normalizeTasksShortcuts({ tasks })

  validateParamsJsonSchemas({ tasks: tasksA })

  return { tasks: tasksA }
}

module.exports = {
  normalizeTasksGenerate,
}
