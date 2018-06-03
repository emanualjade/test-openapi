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

  const events = await eEndTasks({ tasks: tasksB, plugins, config: configA })

  const tasksC = getFinalReturn({ tasks: tasksB, events })

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

  const returnValueA = await eCompleteTask({ returnValue, plugins, config })

  return returnValueA
}

// Run `complete` handlers
const completeTask = async function({ returnValue, plugins, config }) {
  const returnValueA = await runHandlers(returnValue, plugins, 'complete', { config })

  // Only keep single task|error return
  const returnValueB = pick(returnValueA, ['task', 'error'])

  return returnValueB
}

// If a `complete` handle throws, it becomes a `{ error }`
const completeTaskHandler = function(error) {
  return { error }
}

const eCompleteTask = addErrorHandler(completeTask, completeTaskHandler)

// Run `end` handlers
const endTasks = async function({ tasks, plugins, config }) {
  const events = []
  const { events: eventsA } = await runHandlers({ events }, plugins, 'end', { tasks, config })
  return eventsA
}

// If an `end` handle throws, it becomes a `{ type: 'error', error }` event
const endTasksHandler = function(error) {
  return { type: 'error', error }
}

const eEndTasks = addErrorHandler(endTasks, endTasksHandler)

// The top-level command either:
//  - throws error with `error.errors` if any task failed
//  - returns all tasks as an array of `{ type: 'task', ...task }`
const getFinalReturn = function({ tasks, events }) {
  handleFinalFailure({ tasks, events })

  const eventsA = getEvents({ tasks, events })
  return eventsA
}

const handleFinalFailure = function({ tasks, events }) {
  const errors = getFinalErrors({ tasks, events })
  if (errors.length === 0) {
    return
  }

  const error = bundleErrors({ errors })
  error.message = ERROR_MESSAGE

  throw error
}

const getFinalErrors = function({ tasks, events }) {
  const taskErrors = tasks.filter(({ error }) => error !== undefined)
  const errorEvents = events.filter(({ type }) => type === 'error')
  const errors = [...taskErrors, ...errorEvents]
  const errorsA = errors.map(({ error }) => error)
  return errorsA
}

const ERROR_MESSAGE = 'Some tasks failed'

// Transform to an event objects
const getEvents = function({ tasks, events }) {
  const taskEvents = tasks.map(({ task }) => ({ type: 'task', ...task }))
  return [...taskEvents, ...events]
}

module.exports = {
  runTasks: eRunTasks,
}
