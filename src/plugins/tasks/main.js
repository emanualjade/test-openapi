'use strict'

const { loadTasks } = require('./load')
const { validateTasks } = require('./validate')
const { mergeGlob } = require('./glob')
const { normalizeTasks } = require('./normalize')

const getTasks = async function({ tasks, server }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = mergeGlob({ tasks: tasksA })

  const tasksC = normalizeTasks({ tasks: tasksB, server })

  return { tasks: tasksC }
}

module.exports = {
  getTasks,
}
