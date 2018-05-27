'use strict'

const { mapValues } = require('lodash')

const { isObject } = require('../../utils')

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

const normalizeShortcut = function(value) {
  // `undefined` is ignored.
  // object means it's not a shortcut notation.
  if (value === undefined || isObject(value)) {
    return value
  }

  const type = guessType(value)
  return { type, enum: [value] }
}

// When using the shortcut notation, we need to set the `type` to make sure it
// matches the value (in case it is not set, or set to several types, or set to
// a different type)
const guessType = function(value) {
  const [type] = TYPES.find(([, condition]) => condition(value))
  return type
}

const TYPES = Object.entries({
  null: value => value === null,
  integer: Number.isInteger,
  number: value => typeof value === 'number' && !Number.isInteger(value),
  string: value => typeof value === 'string',
  boolean: value => typeof value === 'boolean',
  array: Array.isArray,
})

module.exports = {
  normalizeTasksShortcuts,
}
