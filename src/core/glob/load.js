'use strict'

const { merge } = require('lodash')
const isGlob = require('is-glob')
const { isMatch } = require('micromatch')

// Merge tasks whose name include globbing matching other task names.
// I.e. special task name to allow for shared properties
const load = function(tasks) {
  const { globTasks, nonGlobTasks } = splitTasks({ tasks })
  const tasksA = nonGlobTasks.map(task => mergeGlob({ task, globTasks }))
  return tasksA
}

const splitTasks = function({ tasks }) {
  const globTasks = tasks.filter(isGlobTask)
  const nonGlobTasks = tasks.filter(({ key }) => !isGlobTask({ key }))
  return { globTasks, nonGlobTasks }
}

const isGlobTask = function({ key }) {
  return isGlob(key)
}

const mergeGlob = function({ task, globTasks }) {
  const globTasksA = findGlobTasks({ task, globTasks })
  if (globTasksA.length === 0) {
    return task
  }

  return merge({}, ...globTasksA, task)
}

const findGlobTasks = function({ task: { key }, globTasks }) {
  return globTasks.filter(({ key: taskPattern }) => isMatch(key, taskPattern))
}

module.exports = {
  load,
}
