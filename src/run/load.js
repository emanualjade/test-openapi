'use strict'

const { runHandlers } = require('../plugins')
const { addOriginalTasks } = require('../tasks')

// Run each `plugin.load()`
// Goal is to modify `tasks`.
const loadTasks = async function({ config, config: { tasks }, plugins }) {
  const allTasks = await runHandlers({
    type: 'load',
    plugins,
    input: tasks,
    context: { config },
    mergeReturn,
    json: true,
  })

  const allTasksA = addOriginalTasks({ tasks: allTasks })

  // While `skipped` tasks are still returned and reported, `excluded` tasks
  // are not.
  // They still need to be available in `allTasks` for recursive `_runTask()`
  const tasksA = allTasksA.filter(({ excluded }) => !excluded)

  return { ...config, _allTasks: allTasksA, tasks: tasksA }
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
