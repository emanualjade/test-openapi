'use strict'

const { mergeEach } = require('./each')

// Normalize tasks to format easy to work with when tasks are running
const normalizeTasks = function({ tasks }) {
  const tasksA = mergeEach({ tasks })

  const tasksB = Object.entries(tasksA).map(normalizeTask)
  return tasksB
}

const normalizeTask = function([taskKey, task]) {
  return { ...task, originalTask: task, taskKey }
}

module.exports = {
  normalizeTasks,
}
