'use strict'

const { serializeOutput } = require('../../../serialize')
const { callReporters } = require('../call')
const { isSilentTask, filterTaskData } = require('../level')

// Call reporters `complete` handlers
const callComplete = async function({
  task,
  task: { error: { nested } = {} },
  reporters,
  config,
  startData,
  plugins,
}) {
  // JSON serialization is performed only during reporting because:
  //  - `runTask()` should return non-serialized tasks
  //  - return value (including `error.tasks`) does not need to be serialized
  //    since it is consumed in JavaScript
  // We do not need to omit `originalTask` as it is already removed at that point.
  const taskA = serializeOutput({ task, plugins })

  const arg = getArg.bind(null, { task: taskA, plugins })
  const context = getContext.bind(null, { task: taskA, config, startData, plugins })

  await callReporters({ reporters, type: 'complete' }, arg, context)

  // Recurse over `task.error.nested`
  if (nested === undefined) {
    return
  }

  await callComplete({ task: { ...nested, isNested: true }, reporters, config, startData, plugins })
}

const getArg = function({ task, plugins }, { options }) {
  return filterTaskData({ task, options, plugins })
}

const getContext = function({ task, config, startData, plugins }, { options }) {
  const silent = isSilentTask({ task, options })

  return { config, startData, plugins, silent }
}

module.exports = {
  callComplete,
}
