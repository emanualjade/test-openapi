'use strict'

const { addErrorHandler } = require('../errors')
const { runHandlers } = require('../plugins')

// Run each `plugin.complete()`
const completeTask = async function({ task, context, plugins }) {
  // `task` cannot be modified
  await runHandlers({
    type: 'complete',
    plugins,
    input: task,
    context,
  })

  return task
}

// Errors in `complete` handlers return `task.error`, just like the ones in
// `run` handlers
const completeTaskHandler = function(error, { task }) {
  return { ...task, error }
}

const eCompleteTask = addErrorHandler(completeTask, completeTaskHandler)

module.exports = {
  completeTask: eCompleteTask,
}
