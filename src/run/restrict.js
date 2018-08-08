'use strict'

const { getPath } = require('../utils')
const { restrictOutput } = require('../validation')

// JSON restriction is performed between `run` and `complete` handlers because:
//  - it makes reporting and return value use the same value
//  - `runTask()` should return non-restricted tasks
const restrictTaskOutput = function({ task: { originalTask, ...task }, task: { key }, plugins }) {
  const state = {}

  const taskA = restrictOutput(task, setRestrictError.bind(null, { key, plugins, state }))

  // We use a `state` object because `crawl` utility does not allow returning both
  // the crawled object and extra information
  if (state.error !== undefined) {
    taskA.error = state.error
  }

  // We do not restrict/modify `originalTask` so it keeps reflecting the input
  return { ...taskA, originalTask }
}

const setRestrictError = function({ key, plugins, state }, { message, value, path }) {
  // Use a bug error
  const error = new Error(`Task '${key}' ${message}`)

  const property = getPath(['task', ...path])
  const module = guessModule({ path, plugins })
  Object.assign(error, { value, property, module })

  state.error = error
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
  restrictTaskOutput,
}
