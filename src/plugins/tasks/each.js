'use strict'

const { mapValues, merge, pickBy, omitBy } = require('lodash')

// Merge `each` to each task and `taskPrefix.each` to each `taskPrefix.*` task
// I.e. `each` is a special task name to allow for shared properties
const mergeEach = function({ tasks }) {
  const tasksA = mergeTopEach({ tasks })
  const tasksB = mergeTasksEach({ tasks: tasksA })
  return tasksB
}

// Merge `each`
const mergeTopEach = function({ tasks: { each: eachTask, ...tasks } }) {
  if (eachTask === undefined) {
    return tasks
  }

  const tasksA = mapValues(tasks, task => merge({}, eachTask, task))
  return tasksA
}

// Merge `taskPrefix.each` to each `taskPrefix.*`
const mergeTasksEach = function({ tasks }) {
  const tasksEach = pickBy(tasks, isTaskEach)
  const tasksA = omitBy(tasks, isTaskEach)
  const tasksB = mapValues(tasksA, (task, taskName) => mergeTaskEach({ task, taskName, tasksEach }))
  return tasksB
}

const mergeTaskEach = function({ task, taskName, tasksEach }) {
  const taskEach = Object.entries(tasksEach).find(([eachName]) =>
    startWithEachPrefix({ taskName, eachName }),
  )
  if (taskEach === undefined) {
    return task
  }

  return merge({}, taskEach[1], task)
}

const isTaskEach = function(value, taskName) {
  return EACH_REGEXP.test(taskName)
}

const startWithEachPrefix = function({ taskName, eachName }) {
  const prefix = eachName.replace(EACH_REGEXP, '')
  return taskName.startsWith(`${prefix}.`)
}

const EACH_REGEXP = /\.each$/

module.exports = {
  mergeEach,
}
