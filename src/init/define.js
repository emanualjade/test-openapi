'use strict'

const { addErrorHandler, runTaskHandler } = require('../errors')

const { runTask: originalRunTask } = require('./run')

// Main entry point of tasks definition
const defineTasks = function({ config: { tasks, runTask, ...config }, plugins, errors }) {
  const handlers = getHandlers({ plugins, config, tasks, errors })

  // Define all tasks with `it()`
  describe(DESCRIBE_TITLE, () => defineAllTasks({ tasks, runTask, handlers, plugins }))
}

const DESCRIBE_TITLE = 'Tasks'

const defineAllTasks = function({ tasks, runTask, handlers, plugins }) {
  tasks.forEach(task => defineTask({ task, runTask, handlers, plugins }))
}

// Define a single task with `it()`
// TODO: fix title when we refactor how reporting is done
// Method and path should be included in titles.
const defineTask = function({ task, task: { taskKey }, runTask, handlers, plugins }) {
  // This means `this` context is lost.
  // We can remove the arrow function if we ever need the context.
  // Timeout is handled differently (i.e. not by the runner)
  it(taskKey, () => runTask(task, handlers, plugins), 0)
}

// Wrap each `task` plugin handler so they pass some extra read-only arguments
// Also add error handling
const getHandlers = function({
  plugins,
  plugins: {
    handlers: { task: taskHandlers },
    properties: { error: errorProperties },
  },
  config,
  tasks,
  errors,
}) {
  // Those arguments are passed to each task, but cannot be modified
  const readOnlyArgs = { config, tasks }

  const handlers = taskHandlers.map(handler =>
    getHandler({ handler, readOnlyArgs, errors, errorProperties }),
  )

  // Pass `runTask` for recursive tasks
  // If some plugins (like the `repeat` plugin) monkey patch `runTask()`, the
  // non-monkey patched version is passed instead
  // We need to directly mutate it because of recursion
  readOnlyArgs.runTask = task => originalRunTask(task, handlers, plugins)

  return handlers
}

const getHandler = function({ handler, readOnlyArgs, errors, errorProperties }) {
  const handlerA = (task, ...args) => handler({ ...task, ...readOnlyArgs }, ...args)
  const handlerB = addErrorHandler(handlerA, runTaskHandler.bind(null, { errors, errorProperties }))
  return handlerB
}

module.exports = {
  defineTasks,
}
