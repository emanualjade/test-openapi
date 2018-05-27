'use strict'

const { loadTasks } = require('./load')
const { validateTasks } = require('./validate')
const { normalizeTasks } = require('./normalize')

const getTasks = async function({ tasks, server }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA, server })

  return { tasks: tasksB }
}

module.exports = {
  getTasks,
}
