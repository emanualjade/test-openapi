'use strict'

const { capitalize } = require('underscore.string')

const { getPath } = require('../utils')
const { convertPlainObject, BugError } = require('../errors')
const { serializeOutput } = require('../tasks')

// JSON serialization is performed between `run` and `complete` handlers because:
//  - it makes reporting and return value use the same value
//  - `runTask()` should return non-serialized tasks
const serializeTaskOutput = function({ task: { originalTask, ...task }, plugins }) {
  const state = {}

  const taskA = convertTaskError({ task })

  const taskB = serializeOutput(taskA, setSerializeError.bind(null, { plugins, state }))

  // We use a `state` object because `crawl` utility does not allow returning both
  // the crawled object and extra information
  if (state.error !== undefined) {
    taskB.error = convertPlainObject(state.error)
  }

  // We do not serialize `originalTask` so it keeps reflecting the input
  return { ...taskB, originalTask }
}

// Convert errors to plain objects
const convertTaskError = function({ task, task: { error } }) {
  if (error === undefined) {
    return task
  }

  const errorA = convertError({ error })
  return { ...task, error: errorA }
}

const convertError = function({ error, error: { nested, nested: { error: nestedError } = {} } }) {
  const errorA = convertPlainObject(error)

  if (nestedError === undefined) {
    return errorA
  }

  const nestedErrorA = convertError({ error: nestedError })
  return { ...errorA, nested: { ...nested, error: nestedErrorA } }
}

const setSerializeError = function({ plugins, state }, { message, value, path }) {
  const messageA = capitalize(message)
  // Make sure `error.value` is JSON serializable
  const valueA = String(value)
  const property = getPath(['task', ...path])
  const module = guessModule({ path, plugins })

  state.error = new BugError(messageA, { value: valueA, property, module })
}

// Try to guess `error.module` from where the value was in task.*
// This is not error-proof since plugins can modify input of other plugins.
const guessModule = function({ path: [name], plugins }) {
  const plugin = plugins.find(({ name: nameA }) => nameA === name)
  if (plugin === undefined) {
    return
  }

  return `plugin-${name}`
}

module.exports = {
  serializeTaskOutput,
}
