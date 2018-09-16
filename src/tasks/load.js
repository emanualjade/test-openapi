'use strict'

const { promisify } = require('util')
const { readFile } = require('fs')

const fastGlob = require('fast-glob')
const { load: loadYaml, JSON_SCHEMA } = require('js-yaml')
const { sortBy } = require('lodash')

const { addErrorHandler, TestOpenApiError } = require('../errors')

const { validateFileTasks, validateInlineTasks } = require('./validate')
const { addScopes, addKey, validateScopes } = require('./scope')

// Load tasks.
// Tasks are specified as an array of objects instead of a map of objects
// (with `task.name` as key) because:
//  - it is closer to final output. Final output needs to be an array to be
//    streaming-friendly.
//  - it gives a stronger sense that tasks are run in parallel.
//  - it allows `task.name` to be `undefined`.
const loadTasks = async function({ tasks }) {
  const fileTasks = await loadFileTasks({ tasks })

  const inlineTasks = loadInlineTasks({ tasks })

  const tasksA = [...fileTasks, ...inlineTasks]

  const tasksB = tasksA.map(addKey)

  // Ensure task object keys order is always the same, because it's the one
  // used for reporting and we want an ordered and stable output
  const tasksC = sortBy(tasksB, 'scope')
  return tasksC
}

// Load tasks that are specified in files
const loadFileTasks = async function({ tasks }) {
  const tasksA = tasks.filter(task => typeof task === 'string')

  // Can use globbing
  const paths = await fastGlob(tasksA)

  validateScopes({ paths })

  const tasksB = await Promise.all(paths.map(path => loadTaskFile({ path })))
  const tasksC = [].concat(...tasksB)

  return tasksC
}

// Load and parse each task file in parallel
const loadTaskFile = async function({ path }) {
  const content = await eReadFile(path)
  const tasks = eParseTaskFile({ path, content })

  validateFileTasks({ tasks, path })

  const tasksA = addScopes({ tasks, path })
  return tasksA
}

const readFileHandler = function({ message }, path) {
  throw new TestOpenApiError(`Could not load task file '${path}': ${message}`)
}

const eReadFile = addErrorHandler(promisify(readFile), readFileHandler)

// YAML parsing
const parseTaskFile = function({ path, content }) {
  return loadYaml(content, { ...YAML_OPTS, filename: path })
}

const YAML_OPTS = {
  schema: JSON_SCHEMA,
  json: true,
  onWarning(error) {
    throw error
  },
}

const parseTaskFileHandler = function({ message }, { path }) {
  throw new TestOpenApiError(
    `Task file '${path}' is not valid YAML nor JSON: ${message}`,
  )
}

const eParseTaskFile = addErrorHandler(parseTaskFile, parseTaskFileHandler)

// Load tasks that are specified directly as objects
const loadInlineTasks = function({ tasks }) {
  const tasksA = tasks.filter(task => typeof task !== 'string')

  validateInlineTasks({ tasks: tasksA })

  return tasksA
}

module.exports = {
  loadTasks,
}
