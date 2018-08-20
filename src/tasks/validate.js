'use strict'

const { isObject } = require('../utils')
const { TestOpenApiError } = require('../errors')

// Validate content of tasks specified in files
const validateFileTasks = function({ tasks, path }) {
  if (!Array.isArray(tasks)) {
    throw new TestOpenApiError(
      `Task file '${path}' should be an array of objects not a ${typeof tasks}`,
    )
  }

  tasks.forEach(task => validateFileTask({ task, path }))
}

const validateFileTask = function({ task, path }) {
  if (isObject(task)) {
    return
  }

  throw new TestOpenApiError(
    `Task file '${path}' contains a task that is a ${typeof task} instead of an object`,
  )
}

// Validate content of tasks specified inline
const validateInlineTasks = function({ tasks }) {
  tasks.forEach(validateInlineTask)
}

const validateInlineTask = function(task) {
  if (isObject(task)) {
    return
  }

  throw new TestOpenApiError(
    `One of the inline tasks is a ${typeof task} but it should instead be an object`,
  )
}

// Validate syntax of task files
const validateTasksSyntax = function({ tasks }) {
  if (tasks.length === 0) {
    throw new TestOpenApiError('No tasks were found')
  }

  tasks.forEach(validateTaskSyntax)
}

const validateTaskSyntax = function({ path, key, ...task }) {
  if (typeof key === 'string' && key !== '') {
    return
  }

  const pathA = path === undefined ? '' : `at path '${path}' `
  throw new TestOpenApiError(
    `The following task ${pathA}is missing a 'key':\n${JSON.stringify(task, null, 2)}`,
  )
}

module.exports = {
  validateFileTasks,
  validateInlineTasks,
  validateTasksSyntax,
}
