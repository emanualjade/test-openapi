'use strict'

const { addErrorHandler, topLevelHandler, handleFinalFailure } = require('../errors')
const { loadConfig } = require('../config')
const { getTasks, removeOriginalTasks } = require('../tasks')
const { loadPlugins } = require('../plugins')

const { loadTasks } = require('./load')
const { startTasks } = require('./start')
const { runTask } = require('./run')
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

  const tasks = await getTasks({ config: configA })

  const plugins = loadPlugins({ config: configA })

  const tasksA = await ePerformRun({ config: configA, tasks, plugins })
  return tasksA
}

const eRun = addErrorHandler(run, topLevelHandler)

// Fire all plugin handlers for all tasks
const performRun = async function({ config, tasks, plugins }) {
  const { tasks: tasksA, allTasks } = await loadTasks({ config, tasks, plugins })
  const context = { _tasks: tasksA, _allTasks: allTasks }

  const startData = await startTasks({ config, context, plugins })
  const contextA = { ...context, startData }

  const tasksB = await fireTasks({ tasks: tasksA, context: contextA, plugins })

  await endTasks({ tasks: tasksB, config, context: contextA, plugins })

  const tasksC = removeOriginalTasks({ tasks: tasksB })

  handleFinalFailure({ tasks: tasksC })

  return tasksC
}

// Add `error.plugins` to every thrown error
const performRunHandler = function(error, { plugins }) {
  error.plugins = plugins.map(({ name }) => name)
  throw error
}

const ePerformRun = addErrorHandler(performRun, performRunHandler)

// Fire all tasks in parallel
const fireTasks = function({ tasks, context, plugins }) {
  const tasksA = tasks.map(task => fireTask({ task, context, plugins }))
  return Promise.all(tasksA)
}

const fireTask = async function({ task, context, plugins }) {
  const taskA = await runTask({ task, context, plugins })

  const taskC = await completeTask({ task: taskA, context, plugins })

  return taskC
}

module.exports = {
  run: eRun,
}
