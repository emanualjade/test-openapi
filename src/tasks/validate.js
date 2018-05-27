'use strict'

const { isEqual } = require('lodash')

const { TestOpenApiError, addErrorHandler } = require('../errors')
const { validateFromSchema, isObject } = require('../utils')

const TASK_SCHEMA = require('./schema')

// Make sure task files are not empty
const validateTaskFile = function({ tasks, path }) {
  if (isObject(tasks)) {
    return
  }

  throw new TestOpenApiError(`Task file '${path}' should be an object not a ${typeof tasks}`)
}

// Validate syntax of task files
const validateTasks = function({ tasks }) {
  validateEmptyTasks({ tasks })

  Object.entries(tasks).forEach(validateTask)
}

const validateEmptyTasks = function({ tasks }) {
  if (Object.keys(tasks).length !== 0) {
    return
  }

  throw new TestOpenApiError('No tasks were found')
}

const validateTask = function([taskKey, task]) {
  validateJson({ taskKey, task })
  validateTaskSchema({ taskKey, task })
}

// Tasks are constrained to JSON
// This also validates against circular references
const validateJson = function({ taskKey, task }) {
  const copy = eCloneTask({ task, taskKey })
  // TODO: replace with util.isDeepStrictEqual() when we upgrade Node.js
  if (isEqual(task, copy)) {
    return
  }

  throw new TestOpenApiError(`Task '${taskKey}' is not valid JSON`, { taskKey })
}

const cloneTask = function({ task }) {
  return JSON.parse(JSON.stringify(task))
}

const cloneTaskHandler = function({ message }, { taskKey }) {
  throw new TestOpenApiError(`Task '${taskKey}' is not valid JSON: ${message}`, { taskKey })
}

const eCloneTask = addErrorHandler(cloneTask, cloneTaskHandler)

const validateTaskSchema = function({ taskKey, task }) {
  const { error, path } = validateFromSchema({ schema: TASK_SCHEMA, value: task, name: taskKey })
  if (error === undefined) {
    return
  }

  throw new TestOpenApiError(`Task '${taskKey}' is invalid: ${error}`, { taskKey, property: path })
}

module.exports = {
  validateTaskFile,
  validateTasks,
}
