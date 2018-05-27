'use strict'

const { isDeepStrictEqual } = require('util')

const { throwTaskError, addErrorHandler } = require('../../../errors')
const { validateFromSchema, isObject } = require('../../../utils')

const TASK_SCHEMA = require('./schema')

// Make sure task files are not empty
const validateTaskFile = function({ tasks, path }) {
  if (isObject(tasks)) {
    return
  }

  throwTaskError(`Task file '${path}' should be an object not a ${typeof tasks}`)
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

  throwTaskError('No tasks were found')
}

const validateTask = function([taskKey, task]) {
  eValidateJson({ taskKey, task })
  validateTaskSchema({ taskKey, task })
}

// Tasks are constrained to JSON
// This also validates against circular references
const validateJson = function({ taskKey, task }) {
  const copy = JSON.parse(JSON.stringify(task))
  if (isDeepStrictEqual(task, copy)) {
    return
  }

  throwTaskError(`Task '${taskKey}' is not valid JSON`, { task: taskKey })
}

const validateJsonHandler = function({ message }, { taskKey }) {
  throwTaskError(`Task '${taskKey}' is not valid JSON: ${message}`, { task: taskKey })
}

const eValidateJson = addErrorHandler(validateJson, validateJsonHandler)

const validateTaskSchema = function({ taskKey, task }) {
  const { error, path } = validateFromSchema({ schema: TASK_SCHEMA, value: task, name: taskKey })
  if (error === undefined) {
    return
  }

  throwTaskError(`Task '${taskKey}' is invalid: ${error}`, { task: taskKey, property: path })
}

module.exports = {
  validateTaskFile,
  validateTasks,
}
