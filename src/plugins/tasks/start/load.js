'use strict'

const { promisify } = require('util')
const { readFile } = require('fs')

const fastGlob = require('fast-glob')
const { load: loadYaml, JSON_SCHEMA } = require('js-yaml')

const { isObject } = require('../../../utils')
const { addErrorHandler, throwTaskError } = require('../../../errors')

const { validateTaskFile } = require('./validate')

// Load YAML/JSON task files
const loadTasks = async function({ tasks }) {
  // Tasks can either be directly a plain object
  if (isObject(tasks)) {
    return tasks
  }

  // Can use globbing
  const tasksA = await fastGlob(tasks)

  const tasksB = await Promise.all(tasksA.map(loadTaskFile))
  const tasksC = Object.assign({}, ...tasksB)

  return tasksC
}

// Load and parse each task file in parallel
const loadTaskFile = async function(path) {
  const content = await eReadFile(path)
  const tasks = eParseTaskFile({ path, content })

  validateTaskFile({ tasks, path })

  return tasks
}

// File loading
const readFileHandler = function({ message }, path) {
  throwTaskError(`Could not load task file '${path}': ${message}`)
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
  throwTaskError(`Task file '${path}' is not valid YAML or JSON: ${message}`)
}

const eParseTaskFile = addErrorHandler(parseTaskFile, parseTaskFileHandler)

module.exports = {
  loadTasks,
}
