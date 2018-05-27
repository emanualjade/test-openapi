'use strict'

const { loadTasks } = require('./load')
const { validateTasks } = require('./validation')
const { normalizeTasks } = require('./normalize')
const { normalizeTasksParams } = require('./params')
const { normalizeTasksValidate } = require('./validate')

// Retrieve list of tasks
const getTasks = async function({ tasks, spec }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA, spec })

  const tasksC = normalizeTasksParams({ tasks: tasksB })

  const tasksD = normalizeTasksValidate({ tasks: tasksC })

  return { tasks: tasksD }
}

module.exports = {
  getTasks,
}
