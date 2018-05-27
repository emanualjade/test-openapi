'use strict'

const { mapValues } = require('lodash')

const { isObject } = require('../utils')

const { runHandlers } = require('./plugins')

// Run an `it()` task
const runTask = async function({ originalTask, ...task }, handlers) {
  const taskA = await runHandlers(task, handlers)
  // Task return value, returned to users and used by depReqs
  const taskB = mapValues(taskA, (newTask, prop) => shallowMerge(originalTask[prop], newTask))
  return taskB
}

// Do a shallow merge on each plugin value
// The originalTask properties has less priority
const shallowMerge = function(originalTask, newTask) {
  if (newTask === undefined) {
    return originalTask
  }

  if (!isObject(originalTask) || !isObject(newTask)) {
    return newTask
  }

  return { ...originalTask, ...newTask }
}

module.exports = {
  runTask,
}
