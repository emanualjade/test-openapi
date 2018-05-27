'use strict'

const { mergeGlob } = require('../glob')

const { loadTasks } = require('./load')
const { validateTasks } = require('./validate')
const { normalizeTasks } = require('./normalize')
const { normalizeTasksParamsBefore } = require('./params')

const getTasks = async function({ tasks, server }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA })

  const tasksC = mergeGlob({ tasks: tasksB })

  const tasksD = normalizeTasksParamsBefore({ tasks: tasksC, server })

  return { tasks: tasksD }
}

module.exports = {
  getTasks,
}
