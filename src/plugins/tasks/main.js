'use strict'

const { loadTasks } = require('./load')
const { validateTasks } = require('./validate')
const { normalizeTasks } = require('./normalize')

// Retrieve list of tasks
const getTasks = async function({ tasks, spec }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA, spec })

  return { tasks: tasksB }
}

module.exports = {
  getTasks,
}
