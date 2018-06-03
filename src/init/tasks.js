'use strict'

const { pick } = require('lodash')

const { runHandlers } = require('../plugins')
const { addErrorHandler, bundleErrors } = require('../errors')

const { runTask: originalRunTask } = require('./task')

// Run all tasks in parallel
const runTasks = async function({ config, plugins }) {
  const { runTask, ...configA } = await runHandlers(
    { ...config, runTask: originalRunTask },
    plugins,
    'start',
  )

  const readOnlyArgs = getReadOnlyArgs({ config: configA, runTask, plugins })

  const { tasks } = configA
  const tasksA = tasks.map(task =>
    launchTask({ task, runTask, config: configA, readOnlyArgs, plugins }),
  )
  const tasksB = await Promise.all(tasksA)

  const tasksC = getFinalReturn({ tasks: tasksB })

  return tasksC
}

const runTasksHandler = function(error, { plugins }) {
  error.plugins = plugins.map(({ name }) => name)
  throw error
}

const eRunTasks = addErrorHandler(runTasks, runTasksHandler)

// Passed to every task handler
const getReadOnlyArgs = function({ config, runTask, plugins }) {
  // Those arguments are passed to each task, but cannot be modified
  const readOnlyArgs = { config }

  // Must directly mutate to handle recursion
  readOnlyArgs.runTask = runRecursiveTask.bind(null, { runTask, plugins, readOnlyArgs })

  return readOnlyArgs
}

// Pass `runTask` for recursive tasks, with the second argument bound
// Also tasks can use `isNested` to know if this is a recursive call
const runRecursiveTask = async function({ runTask, plugins, readOnlyArgs }, task) {
  const { task: taskA, error } = await runTask(task, { plugins, readOnlyArgs, isNested: true })

  // Propagate to parent
  if (error) {
    throw error
  }

  // Returns `taskA` not `{ task: taskA }`
  return taskA
}

const launchTask = async function({ task, runTask, config, readOnlyArgs, plugins }) {
  // Returns `{ tasks, task, errors, error }`
  const returnValue = await runTask(task, { readOnlyArgs, plugins })

  // Run `complete` handlers
  // `complete` handlers should not throw
  const returnValueA = await runHandlers(returnValue, plugins, 'complete', { config })

  // Only keep single task|error return
  const returnValueB = pick(returnValueA, ['task', 'error'])

  return returnValueB
}

// The top-level command either:
//  - throws error with `error.errors` if any task failed
//  - returns all tasks as an array of `{ type: 'task', ...task }`
const getFinalReturn = function({ tasks }) {
  const errors = tasks.filter(({ error }) => error !== undefined).map(({ error }) => error)

  if (errors.length === 0) {
    return getSuccessReturn({ tasks })
  }

  return getFailureReturn({ errors })
}

const getSuccessReturn = function({ tasks }) {
  return tasks.map(({ task }) => ({ type: 'task', ...task }))
}

const getFailureReturn = function({ errors }) {
  const error = bundleErrors({ errors })
  error.message = ERROR_MESSAGE

  throw error
}

const ERROR_MESSAGE = 'Some tasks failed'

module.exports = {
  runTasks: eRunTasks,
}
