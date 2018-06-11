'use strict'

const { pick } = require('lodash')

const { runHandlers } = require('../plugins')

// Run each `plugin.complete()`
const completeTask = async function({ returnValue, plugins, config }) {
  const returnValueA = await runHandlers(
    returnValue,
    plugins,
    'complete',
    { config },
    completePluginHandler,
  )

  // Only keep single task|error return
  const returnValueB = pick(returnValueA, ['task', 'error'])

  return returnValueB
}

// If a `complete` plugin handle throws, it adds an `{ error }`
const completePluginHandler = function(error, { task }) {
  Object.assign(error, { task })
  return { error }
}

module.exports = {
  completeTask,
}
