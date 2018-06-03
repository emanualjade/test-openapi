'use strict'

const { pick } = require('lodash')

const { runHandlers } = require('../plugins')

// Main entry point of tasks definition
const defineTasks = function({ config: { runTask, ...config }, plugins, errors }) {
  const readOnlyArgs = getReadOnlyArgs({ config, runTask, plugins })

  // Define all tasks with `it()`
  describe(DESCRIBE_TITLE, () => defineAllTasks({ config, runTask, readOnlyArgs, plugins, errors }))
}

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

const DESCRIBE_TITLE = 'Tasks'

const defineAllTasks = function({ config: { tasks }, runTask, readOnlyArgs, plugins, errors }) {
  tasks.forEach(task => defineTask({ task, runTask, readOnlyArgs, plugins, errors }))
}

// Define a single task with `it()`
// TODO: fix title when we refactor how reporting is done
// Method and path should be included in titles.
const defineTask = function({ task, task: { taskKey }, runTask, readOnlyArgs, plugins, errors }) {
  // Timeout is handled differently (i.e. not by the runner)
  it(taskKey, launchTask.bind(null, { task, runTask, readOnlyArgs, plugins, errors }), 0)
}

const launchTask = async function({
  task,
  runTask,
  readOnlyArgs,
  readOnlyArgs: { config },
  plugins,
  errors,
}) {
  // Returns `{ tasks, task, errors, error }`
  const returnValue = await runTask(task, { readOnlyArgs, plugins })

  // Run `complete` handlers
  // `complete` handlers should not throw
  const returnValueA = await runHandlers(returnValue, plugins, 'complete', { config })

  // Only keep single task|error return
  const returnValueB = pick(returnValueA, ['task', 'error'])

  // TODO: temporary as long as if we use Jasmine
  const { error } = returnValueB
  if (error !== undefined) {
    errors.push(error)
    throw error
  }

  return returnValueB
}

module.exports = {
  defineTasks,
}
