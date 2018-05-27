'use strict'

const { merge } = require('lodash')
const isGlob = require('is-glob')
const { isMatch } = require('micromatch')

// Merge tasks whose name include globbing matching other task names.
// I.e. special task name to allow for shared properties
const mergeGlob = function({ tasks }) {
  const { globTasks, nonGlobTasks } = splitTasks({ tasks })
  const tasksA = nonGlobTasks.map(task => mergeGlobTasks({ task, globTasks }))
  return { tasks: tasksA }
}

const splitTasks = function({ tasks }) {
  const globTasks = tasks.filter(isGlobTask)
  const nonGlobTasks = tasks.filter(({ taskKey }) => !isGlobTask({ taskKey }))
  return { globTasks, nonGlobTasks }
}

const isGlobTask = function({ taskKey }) {
  return isGlob(taskKey)
}

const mergeGlobTasks = function({ task, globTasks }) {
  const globTasksA = findGlobTasks({ task, globTasks })
  if (globTasksA.length === 0) {
    return task
  }

  return merge({}, ...globTasksA, task)
}

const findGlobTasks = function({ task: { taskKey }, globTasks }) {
  return globTasks.filter(({ taskKey: taskPattern }) => isMatch(taskKey, taskPattern))
}

module.exports = {
  mergeGlob,
}
