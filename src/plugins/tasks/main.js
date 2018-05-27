'use strict'

const { loadTasks } = require('./load')
const { validateTasks } = require('./validation')
const { normalizeTasks } = require('./normalize')
const { normalizeTasksShortcuts } = require('./shortcut')
const { validateTasksJsonSchemas } = require('./json_schema')
const { normalizeTasksParams } = require('./params')
const { normalizeTasksValidate } = require('./validate')

// Retrieve list of tasks
const getTasks = async function({ tasks }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA })

  const tasksC = normalizeTasksShortcuts({ tasks: tasksB })

  validateTasksJsonSchemas({ tasks: tasksC })

  const tasksD = normalizeTasksParams({ tasks: tasksC })

  const tasksE = normalizeTasksValidate({ tasks: tasksD })

  return { tasks: tasksE }
}

module.exports = {
  getTasks,
}
