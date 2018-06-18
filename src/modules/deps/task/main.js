'use strict'

const { findRefs } = require('./find')
const { runDeps } = require('./run')
const { setRefs } = require('./set')

// Replace all `deps`, i.e. references to other tasks.
const taskFunc = function(task, { config: { tasks } }, { runTask }) {
  const refs = findRefs({ task, tasks })

  if (refs.length === 0) {
    return
  }

  return runAndSetDeps({ task, tasks, refs, runTask })
}

const runAndSetDeps = async function({ task, tasks, refs, runTask }) {
  const depReturns = await runDeps({ task, tasks, refs, runTask })

  const taskA = setRefs({ task, refs, depReturns })
  return taskA
}

module.exports = {
  task: taskFunc,
}
