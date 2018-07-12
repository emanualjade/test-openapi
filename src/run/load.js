'use strict'

const { runHandlers } = require('../plugins')

// Run each `plugin.load()`
// Goal is to modify `tasks`.
// Remember that this will be used by recursive `_runTask()` as well.
// For example, plugins should flag tasks as `skipped` but not filter them out
// even if could still be used in recursive tasks.
const loadTasks = async function({ config, config: { tasks }, plugins }) {
  const tasksA = await runHandlers({
    type: 'load',
    plugins,
    input: tasks,
    context: { config },
    mergeReturn,
  })
  return { ...config, tasks: tasksA }
}

const mergeReturn = function(input, newInput) {
  if (newInput === undefined) {
    return input
  }

  return newInput
}

module.exports = {
  loadTasks,
}
