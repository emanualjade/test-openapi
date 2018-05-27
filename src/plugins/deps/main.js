'use strict'

const { findRefs } = require('./find')
const { runDeps } = require('./run')
const { setRefs } = require('./set')

// Replace all `deps`, i.e. references to other tasks.
const replaceDeps = function(task, { config, runTask }) {
  const refs = findRefs({ task, config })

  if (refs.length === 0) {
    return
  }

  return runAndSetDeps({ task, config, refs, runTask })
}

const runAndSetDeps = async function({ task, config, refs, runTask }) {
  const depReturns = await runDeps({ task, config, refs, runTask })

  const taskA = setRefs({ task, config, refs, depReturns })
  return taskA
}

module.exports = {
  replaceDeps,
}
