'use strict'

const { loadTasks } = require('./load')
const { validateTasks } = require('./validate')
const { normalizeTasks } = require('./normalize')

// Retrieve tasks files as an array of normalized task objects
const getTasks = async function({ tasks }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA })

  return { tasks: tasksB }
}

module.exports = {
  getTasks,
}
