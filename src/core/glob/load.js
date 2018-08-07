'use strict'

const isGlob = require('is-glob')
const { isMatch } = require('micromatch')

const { merge } = require('../../template')

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

  return merge(...globTasksA, task)
}

const findGlobTasks = function({ task: { key, path }, globTasks }) {
  return globTasks
    .filter(({ key: taskPattern }) => isMatch(key, taskPattern))
    .sort((taskA, taskB) => compareGlobTasks({ taskA, taskB, path }))
}

// Compute which glob tasks have priority over each other.
// Mostly depends on the file it was loaded in with priority:
//   same file > no file > other files in alphabetical order
// Within the same file, globbing tasks declared last in keys order have priority.
// Note that we do not use `config.tasks` order as globbing expansion order is not stable.
const compareGlobTasks = function({ taskA: { path: pathA }, taskB: { path: pathB }, path }) {
  // Inside the same file, we use object keys order, i.e. globbing tasks declared
  // last have priority.
  // Object keys order is not very reliable, so we must make sure `tasks` does not
  // change order since tasks loading.
  // Returning 0 will let `Array.sort()` rely on array order instead.
  if (pathA === pathB) {
    return 0
  }

  // Globbing tasks within the same file have priority
  if (pathA === path) {
    return 1
  }

  if (pathB === path) {
    return -1
  }

  // Globbing tasks within no file (i.e. passed directly as objects) come next
  if (pathA === undefined) {
    return 1
  }

  if (pathB === undefined) {
    return -1
  }

  // We then rely on task file name alphabetical order.
  // Tasks whose filenames is closer to z have higher priority.
  if (pathA < pathB) {
    return -1
  }

  return 1
}

module.exports = {
  load,
}
