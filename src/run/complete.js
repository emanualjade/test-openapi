'use strict'

const { pick } = require('lodash')

const { runHandlers, addTaskErrorProp } = require('../plugins')

// Run `complete` handlers
const completeTask = async function({ returnValue, plugins, config }) {
  const returnValueA = await runHandlers(
    returnValue,
    plugins,
    'complete',
    { config },
    completePluginHandler.bind(null, plugins),
  )

  // Only keep single task|error return
  const returnValueB = pick(returnValueA, ['task', 'error'])

  return returnValueB
}

// If a `complete` plugin handle throws, it adds an `{ error }`
const completePluginHandler = function(plugins, error, { task }) {
  const errorA = addTaskErrorProp({ error, task, plugins })
  return { error: errorA }
}

module.exports = {
  completeTask,
}
