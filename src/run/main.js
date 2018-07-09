'use strict'

const { omit } = require('lodash')

const { addErrorHandler, topLevelHandler, handleFinalFailure } = require('../errors')
const { loadConfig } = require('../config')
const { getTasks } = require('../tasks')
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

  const configB = await getTasks({ config: configA })

  const { config: configC, plugins } = loadPlugins({ config: configB })

  const tasks = await ePerformRun({ config: configC, plugins })
  return tasks
}

const eRun = addErrorHandler(run, topLevelHandler)

// Fire all plugin handlers for all tasks
const performRun = async function({ config, plugins }) {
  const configA = await loadTasks({ config, plugins })

  const configB = await startTasks({ config: configA, plugins })

  const tasks = await fireTasks({ config: configB, plugins })

  await endTasks({ tasks, plugins, config: configB })

  // `originalTask` is kept only for reporters, but is neither reported nor returned
  const tasksA = tasks.map(task => omit(task, 'originalTask'))

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
const fireTasks = function({ config, config: { tasks }, plugins }) {
  const tasksA = tasks.map(task => fireTask({ task, config, plugins }))
  return Promise.all(tasksA)
}

const fireTask = async function({ task, config, plugins }) {
  const taskA = await runTask({ task, config, plugins })

  const taskB = await completeTask({ task: taskA, plugins, config })

  return taskB
}

module.exports = {
  run: eRun,
}
