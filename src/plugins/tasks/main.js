'use strict'

const { loadTasks } = require('./load')
const { validateTasks } = require('./validate')
const { normalizeTasks } = require('./normalize')

const getTasks = async function({ tasks }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA })

  return { tasks: tasksB }
}

module.exports = {
  getTasks,
}
