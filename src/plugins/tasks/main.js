'use strict'

const { loadTasks } = require('./load')
const { validateTasks } = require('./validation')
const { normalizeTasks } = require('./normalize')
const { normalizeTasksShortcuts } = require('./shortcut')
const { validateTasksJsonSchemas } = require('./json_schema')
const { normalizeTasksParams } = require('./params')
const { normalizeTasksValidate } = require('./validate')
const { mergeTasksSpec } = require('./merge')

// Retrieve list of tasks
const getTasks = async function({ tasks, spec }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA, spec })

  const tasksC = normalizeTasksShortcuts({ tasks: tasksB })

  validateTasksJsonSchemas({ tasks: tasksC })

  const tasksD = normalizeTasksParams({ tasks: tasksC })

  const tasksE = normalizeTasksValidate({ tasks: tasksD })

  const tasksF = mergeTasksSpec({ tasks: tasksE })

  return { tasks: tasksF }
}

module.exports = {
  getTasks,
}
