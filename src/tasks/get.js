'use strict'

const { TestOpenApiError } = require('../errors')
const { getPath } = require('../utils')

const { parseInput } = require('./serialize')
const { loadTasks } = require('./load')

// Retrieve tasks files as an array of normalized task objects
const getTasks = async function({ config, config: { tasks } }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA })

  const tasksC = parseTasks({ tasks: tasksB })

  return { ...config, tasks: tasksC }
}

// Validate syntax of task files
const validateTasks = function({ tasks }) {
  if (Object.keys(tasks).length !== 0) {
    return
  }

  throw new TestOpenApiError('No tasks were found')
}

// Normalize tasks from object to array.
const normalizeTasks = function({ tasks }) {
  return Object.entries(tasks).map(normalizeTask)
}

const normalizeTask = function([key, task]) {
  return { ...task, key }
}

// Validate tasks are JSON and turn `undefined` strings into actual `undefined`
const parseTasks = function({ tasks }) {
  return tasks.map(task => parseInput(task, throwParseError.bind(null, task.key)))
}

const throwParseError = function(key, { message, value, path }) {
  const property = getPath(['task', ...path])
  throw new TestOpenApiError(`Task '${key}' ${message}`, { task: key, value, property })
}

module.exports = {
  getTasks,
}
