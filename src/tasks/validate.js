'use strict'

const { omit } = require('lodash')

const { isObject } = require('../utils')
const { TestOpenApiError } = require('../errors')

const { getScope } = require('./scope')

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

  validateDuplicateKeys({ tasks })
}

const validateTaskSyntax = function(task) {
  const syntaxTest = SYNTAX_TESTS.find(({ test }) => test(task))
  if (syntaxTest === undefined) {
    return
  }

  const taskA = omit(task, 'key')
  throw new TestOpenApiError(
    `${syntaxTest.message} in the following task:\n${JSON.stringify(
      taskA,
      null,
      2,
    )}`,
  )
}

const SYNTAX_TESTS = [
  {
    test: ({ name }) => name === undefined || name === '',
    message: "'name' must be defined",
  },
  {
    test: ({ name }) => typeof name !== 'string',
    message: "'name' must be a string",
  },
  {
    test: ({ name }) => name.includes('/'),
    message: "'name' must not contain any slash",
  },
  {
    test: ({ scope }) => scope === '',
    message: "'scope' must not be an empty string",
  },
  {
    test: ({ scope }) => scope !== undefined && typeof scope !== 'string',
    message: "'scope' must not be either undefined or a string",
  },
  {
    test: ({ scope }) => typeof scope === 'string' && scope.includes('/'),
    message: "'scope' must not contain any slash",
  },
]

// `task.key` must be unique
const validateDuplicateKeys = function({ tasks }) {
  tasks.forEach(validateDuplicateKey)
}

const validateDuplicateKey = function({ key, scope, name }, index, tasks) {
  const tasksA = tasks.slice(index + 1)
  const isDuplicate = tasksA.some(({ key: keyA }) => key === keyA)
  if (!isDuplicate) {
    return
  }

  throw new TestOpenApiError(
    `Two tasks in the same 'scope' '${scope}' have the same 'name' '${name}'`,
  )
}

// Since we use filenames as `task.scope` which itself is used in `task.key`,
// and `task.key` must be unique, we validate every filename is unique.
const validateScopes = function({ paths }) {
  const scopes = paths.map(getScope)
  scopes.forEach((scope, index) =>
    validateScope({ scope, index, scopes, paths }),
  )
}

const validateScope = function({ scope, index, scopes, paths }) {
  const scopesA = scopes.slice(index + 1)
  const duplicateScopeIndex = scopesA.indexOf(scope)
  if (duplicateScopeIndex === -1) {
    return
  }

  const path = paths[index]
  const duplicatePath = paths[duplicateScopeIndex + index + 1]
  throw new TestOpenApiError(
    `Each task file name must be unique, but the two following files are not: '${path}' and '${duplicatePath}'`,
  )
}

module.exports = {
  validateFileTasks,
  validateInlineTasks,
  validateTasksSyntax,
  validateScopes,
}
