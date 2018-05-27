'use strict'

const { mapValues } = require('lodash')

const { normalizeShortcut } = require('../../../utils')

// `task.parameters|validate.*: non-object` is shortcut for `{ enum: [value] }`
const normalizeTasksShortcuts = function({ tasks }) {
  return tasks.map(normalizeTaskShortcuts)
}

const normalizeTaskShortcuts = function(task) {
  const taskA = PROPERTIES.map(prop => normalizeShorcuts({ prop, task }))
  const taskB = Object.assign({}, task, ...taskA)
  return taskB
}

const PROPERTIES = ['params', 'validate']

const normalizeShorcuts = function({ prop, task }) {
  const obj = task[prop]
  if (obj === undefined) {
    return {}
  }

  const objA = mapValues(obj, normalizeShortcut)
  return { [prop]: objA }
}

module.exports = {
  normalizeTasksShortcuts,
}
