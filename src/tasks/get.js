'use strict'

const { TestOpenApiError } = require('../errors')
const { getPath } = require('../utils')

const { parseInput } = require('./serialize')
const { loadTasks } = require('./load')
const { validateTasks } = require('./validate')

// Retrieve tasks files as an array of normalized task objects
const getTasks = async function({ config, config: { tasks } }) {
  const tasksA = await loadTasks({ tasks })

  validateTasks({ tasks: tasksA })

  const tasksB = normalizeTasks({ tasks: tasksA })

  const tasksC = parseTasks({ tasks: tasksB })

  return { ...config, tasks: tasksC }
}

// Normalize tasks from object to array.
const normalizeTasks = function({ tasks }) {
  return Object.entries(tasks).map(normalizeTask)
}

const normalizeTask = function([key, task]) {
  return { ...task, key }
}

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
