'use strict'

const { addErrorHandler, topLevelHandler, handleFinalFailure } = require('../errors')
const { loadConfig } = require('../config')
const { getTasks } = require('../tasks')
const { getPlugins } = require('../plugins')

const { startTasks } = require('./start')
const { bootTask } = require('./task')
const { completeTask } = require('./complete')
const { endTasks } = require('./end')

// Main entry point
// Does in order:
//  - load configuration
//  - load tasks
//  - load plugins
//  - run each `plugin.start()`
//  - for each task, in parallel:
//     - run each `plugin.task()`
//     - run each `plugin.complete()`
//  - run each `plugin.end()`
// Return tasks on success
// If any task failed, throw an error instead
const run = async function(config = {}) {
  const configA = loadConfig({ config })

  const configB = await getTasks({ config: configA })

  const { config: configC, plugins } = getPlugins({ config: configB })

  const tasks = await ePerformRun({ config: configC, plugins })
  return tasks
}

const eRun = addErrorHandler(run, topLevelHandler)

// Fire all plugin handlers for all tasks
const performRun = async function({ config, plugins }) {
  const { config: configA, mRunTask } = await startTasks({ config, plugins })

  const tasks = await fireTasks({ config: configA, mRunTask, plugins })

  await endTasks({ tasks, plugins, config: configA })

  handleFinalFailure({ tasks })

  return tasks
}

// Add `error.plugins` to every thrown error
const performRunHandler = function(error, { plugins }) {
  error.plugins = plugins.map(({ name }) => name)
  throw error
}

const ePerformRun = addErrorHandler(performRun, performRunHandler)

// Fire all tasks in parallel
const fireTasks = function({ config, config: { tasks }, mRunTask, plugins }) {
  const tasksA = tasks.map(task => fireTask({ task, config, mRunTask, plugins }))
  return Promise.all(tasksA)
}

const fireTask = async function({ task, task: { originalTask }, config, mRunTask, plugins }) {
  const taskA = await bootTask({ task, config, mRunTask, plugins })

  const taskB = await completeTask({ task: taskA, originalTask, plugins, config })

  return taskB
}

// The following plugins can be run (in order).
// `start`, i.e. before all tasks:
//   - `glob`: merge tasks whose name include globbing matching other task names.
//   - `only`: check if `config|task.only` is used
//   - `skip`: set dry run (`report.output: false`) if `config.skip: *`
//   - `spec`: parse, validate and normalize an OpenAPI specification
//   - `report`: start reporting
//   - `repeat`: repeat each task `config.repeat` times
// `task`, i.e. for each task:
//   - `only`: select tasks according to `config|task.only`
//   - `skip`: skip task if `task.skip: true`
//   - `deps`: replace all `deps`, i.e. references to other tasks
//   - `spec`: add OpenAPI specification to `task.random|validate.*`
//   - `random`: generates random values based on `task.random.*` JSON schemas
//   - `serialize`: stringify request parameters
//   - `url`: build request URL from request parameters
//   - `call`: fire actual HTTP call
//   - `parse`: parse response
//   - `validate`: validate response against `task.validate.*` JSON schemas
// `complete`, i.e. after each tasks:
//   - `report`: reporting for current task
// `end`, i.e. after all tasks:
//   - `report`: end of reporting

module.exports = {
  run: eRun,
}
