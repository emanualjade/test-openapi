'use strict'

const { loadTasks } = require('./load')
const { validateTasks } = require('./validate')

// Retrieve tasks files as an array of normalized task objects
const getTasks = async function({ config, config: { tasks } }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA })

  return { ...config, tasks: tasksB }
}

// Normalize tasks from object to array.
const normalizeTasks = function({ tasks }) {
  return Object.entries(tasks).map(normalizeTask)
}

const normalizeTask = function([key, task]) {
  return { ...task, key }
}

module.exports = {
  getTasks,
}
