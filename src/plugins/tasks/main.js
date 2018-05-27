'use strict'

const { loadTasks } = require('./load')
const { validateTasks } = require('./validation')
const { normalizeTasks } = require('./normalize')
const { normalizeTasksShortcuts } = require('./shortcut')
const { validateTasksJsonSchemas } = require('./json_schema')
const { normalizeTasksValidate } = require('./validate')
const { normalizeTasksParams } = require('./params')

// Retrieve list of tasks
const getTasks = async function({ tasks, server }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA, server })

  const tasksC = normalizeTasksShortcuts({ tasks: tasksB })

  validateTasksJsonSchemas({ tasks: tasksC })

  const tasksD = normalizeTasksValidate({ tasks: tasksC })

  const tasksE = normalizeTasksParams({ tasks: tasksD })

  return { tasks: tasksE }
}

module.exports = {
  getTasks,
}
