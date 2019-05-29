import { readFile } from 'fs'
import { promisify } from 'util'

import fastGlob from 'fast-glob'
import { load as loadYaml, JSON_SCHEMA } from 'js-yaml'
import { sortBy } from 'lodash'

import { TestOpenApiError } from '../errors/error.js'

import { validateFileTasks } from './validate/file.js'
import { validateInlineTasks } from './validate/inline.js'
import { addScopes, addKey, validateScopes } from './scope.js'

const pReadFile = promisify(readFile)

// Load tasks.
// Tasks are specified as an array of objects instead of a map of objects
// (with `task.name` as key) because:
//  - it is closer to final output. Final output needs to be an array to be
//    streaming-friendly.
//  - it gives a stronger sense that tasks are run in parallel.
//  - it allows `task.name` to be `undefined`.
export const loadTasks = async function({ tasks }) {
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
  const tasksC = tasksB.flat()
  return tasksC
}

// Load and parse each task file in parallel
const loadTaskFile = async function({ path }) {
  const content = await readTaskFile(path)
  const tasks = parseTaskFile({ path, content })

  validateFileTasks({ tasks, path })

  const tasksA = addScopes({ tasks, path })
  return tasksA
}

const readTaskFile = async function(path) {
  try {
    return await pReadFile(path)
  } catch (error) {
    throw new TestOpenApiError(
      `Could not load task file '${path}': ${error.message}`,
    )
  }
}

// YAML parsing
const parseTaskFile = function({ path, content }) {
  try {
    return loadYaml(content, { ...YAML_OPTS, filename: path })
  } catch (error) {
    throw new TestOpenApiError(
      `Task file '${path}' is not valid YAML nor JSON: ${error.message}`,
    )
  }
}

const YAML_OPTS = {
  schema: JSON_SCHEMA,
  json: true,
  onWarning(error) {
    throw error
  },
}

// Load tasks that are specified directly as objects
const loadInlineTasks = function({ tasks }) {
  const tasksA = tasks.filter(task => typeof task !== 'string')

  validateInlineTasks({ tasks: tasksA })

  return tasksA
}
