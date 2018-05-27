'use strict'

const { mapValues, merge, pickBy } = require('lodash')
const isGlob = require('is-glob')
const { isMatch } = require('micromatch')

// Merge tasks whose name include globbing matching other task names.
// I.e. special task name to allow for shared properties
const mergeGlob = function({ tasks }) {
  const { globTasks, nonGlobTasks } = splitTasks({ tasks })
  const tasksA = mapValues(nonGlobTasks, (task, taskName) =>
    mergeGlobTasks({ task, taskName, globTasks }),
  )
  return tasksA
}

const splitTasks = function({ tasks }) {
  const globTasks = Object.entries(tasks).filter(([taskName]) => isGlobTask({ taskName }))
  const nonGlobTasks = pickBy(tasks, (value, taskName) => !isGlobTask({ taskName }))
  return { globTasks, nonGlobTasks }
}

const isGlobTask = function({ taskName }) {
  return isGlob(taskName)
}

const mergeGlobTasks = function({ task, taskName, globTasks }) {
  const globTasksA = findGlobTasks({ taskName, globTasks })
  if (globTasksA.length === 0) {
    return task
  }

  return merge({}, ...globTasksA, task)
}

const findGlobTasks = function({ taskName, globTasks }) {
  return globTasks
    .filter(([taskPattern]) => isMatch(taskName, taskPattern))
    .map(([, globTask]) => globTask)
}

module.exports = {
  mergeGlob,
}
