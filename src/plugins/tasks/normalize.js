'use strict'

const { mergeEach } = require('./each')
const { getOperation } = require('./operation')

// Normalize tasks to format easy to work with when tasks are running
const normalizeTasks = function({ tasks, spec }) {
  const tasksA = mergeEach({ tasks })

  const tasksB = Object.entries(tasksA).map(([taskKey, task]) =>
    normalizeTask({ taskKey, task, spec }),
  )
  return tasksB
}

const normalizeTask = function({ taskKey, task, spec }) {
  const { name, operation } = getOperation({ taskKey, spec })
  return { ...task, originalTask: task, taskKey, name, operation }
}

module.exports = {
  normalizeTasks,
}
