'use strict'

const { TestOpenApiError } = require('../errors')
const { getPath } = require('../utils')
const { parseInput } = require('../serialize')

const { loadTasks } = require('./load')
const { validateTasksSyntax } = require('./validate')

// Retrieve tasks as an array of normalized task objects
const getTasks = async function({ config: { tasks } }) {
  const tasksA = await loadTasks({ tasks })

  validateTasksSyntax({ tasks: tasksA })

  const tasksB = parseTasks({ tasks: tasksA })
  return tasksB
}

// Validate tasks are JSON and turn `undefined` strings into actual `undefined`
const parseTasks = function({ tasks }) {
  return tasks.map(task =>
    parseInput(task, throwParseError.bind(null, task.key)),
  )
}

const throwParseError = function(key, { message, value, path }) {
  const property = getPath(['task', ...path])
  throw new TestOpenApiError(`Task '${key}' ${message}`, {
    task: key,
    value,
    property,
  })
}

module.exports = {
  getTasks,
}
