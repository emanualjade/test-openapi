'use strict'

const { mapValues, merge, pickBy, omitBy } = require('lodash')

// Merge `each` to each task and `operationId.each` to each `operationId.*` task
// I.e. `each` is a special task name to allow for shared properties
const mergeEach = function({ tasks }) {
  const tasksA = mergeTopEach({ tasks })
  const tasksB = mergeOperationsEach({ tasks: tasksA })
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

// Merge `operationId.each`
// Note that one can also use `operationId.taskPrefix.each` for all
// `operationId.taskPrefix.*`
const mergeOperationsEach = function({ tasks }) {
  const operationsEach = pickBy(tasks, isOperationEach)
  const tasksA = omitBy(tasks, isOperationEach)
  const tasksB = mapValues(tasksA, (task, taskName) =>
    mergeOperationEach({ task, taskName, operationsEach }),
  )
  return tasksB
}

const mergeOperationEach = function({ task, taskName, operationsEach }) {
  const operationEach = Object.entries(operationsEach).find(([eachName]) =>
    startWithEachPrefix({ taskName, eachName }),
  )
  if (operationEach === undefined) {
    return task
  }

  return merge({}, operationEach[1], task)
}

const isOperationEach = function(value, taskName) {
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
