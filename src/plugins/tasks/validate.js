'use strict'

const { throwTaskError } = require('../../errors')
const { validateFromSchema, isObject } = require('../../utils')

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

const validateTask = function([taskName, task]) {
  const { error, path } = validateFromSchema({ schema: TASK_SCHEMA, value: task, name: taskName })
  if (error === undefined) {
    return
  }

  throwTaskError(`Task '${taskName}' is invalid: ${error}`, { task: taskName, property: path })
}

module.exports = {
  validateTaskFile,
  validateTasks,
}
