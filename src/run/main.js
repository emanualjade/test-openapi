'use strict'

const { addErrorHandler, topLevelHandler, handleFinalFailure } = require('../errors')
const { loadConfig } = require('../config')
const { getTasks, removeOriginalTasks } = require('../tasks')
const { loadPlugins } = require('../plugins')

const { loadTasks } = require('./load')
const { startTasks } = require('./start')
const { runTask } = require('./run')
const { restrictTaskOutput } = require('./restrict')
const { completeTask } = require('./complete')
const { endTasks } = require('./end')

// Main entry point
// Does in order:
//  - load configuration
//  - load tasks
//  - load plugins
//  - run each `plugin.start()`
//  - for each task, in parallel:
//     - run each `plugin.run()`
//     - run each `plugin.complete()`
//  - run each `plugin.end()`
// Return tasks on success
// If any task failed, throw an error instead
const run = async function(config = {}) {
  const configA = loadConfig({ config })

  const configB = await getTasks({ config: configA })

  const { config: configC, plugins } = loadPlugins({ config: configB })

  const tasks = await ePerformRun({ config: configC, plugins })
  return tasks
}

const eRun = addErrorHandler(run, topLevelHandler)

// Fire all plugin handlers for all tasks
const performRun = async function({ config, plugins }) {
  const configA = await loadTasks({ config, plugins })

  const startData = await startTasks({ config: configA, plugins })

  const tasks = await fireTasks({ config: configA, startData, plugins })

  await endTasks({ tasks, plugins, config: configA, startData })

  const tasksA = removeOriginalTasks({ tasks })

  handleFinalFailure({ tasks: tasksA })

  return tasksA
}

// Add `error.plugins` to every thrown error
const performRunHandler = function(error, { plugins }) {
  error.plugins = plugins.map(({ name }) => name)
  throw error
}

const ePerformRun = addErrorHandler(performRun, performRunHandler)

// Fire all tasks in parallel
const fireTasks = function({ config, config: { tasks }, startData, plugins }) {
  const tasksA = tasks.map(task => fireTask({ task, config, startData, plugins }))
  return Promise.all(tasksA)
}

const fireTask = async function({ task, config, startData, plugins }) {
  const taskA = await runTask({ task, config, startData, plugins })

  const taskB = restrictTaskOutput({ task: taskA, plugins })

  const taskC = await completeTask({ task: taskB, startData, plugins, config })

  return taskC
}

module.exports = {
  run: eRun,
}
