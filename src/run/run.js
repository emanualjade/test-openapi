'use strict'

const { addErrorHandler, TestOpenApiError } = require('../errors')
const { runHandlers, getTaskReturn } = require('../plugins')

// Run each `plugin.run()`
const runTask = async function({ task, config, plugins, nestedPath }) {
  const taskA = await eRunAll({ task, config, plugins, nestedPath })

  const taskB = getTaskReturn({ task: taskA, config, plugins })
  return taskB
}

const runAll = function({ task, config, plugins, nestedPath }) {
  const runTaskA = eRecursiveRunTask.bind(null, { config, plugins, nestedPath })

  return runHandlers(
    'run',
    plugins,
    task,
    { config },
    { runTask: runTaskA, nestedPath },
    runPluginHandler,
    stopOnDone,
  )
}

// Pass simplified `runTask()` for recursive tasks
// Tasks can use `nestedPath` to know if this is a recursive call
// As opposed to regular `runTask()`, failed task throws.
const recursiveRunTask = function(
  { config, plugins, nestedPath },
  { task, task: { key }, property, self },
) {
  const nestedPathA = appendNestedPath({ nestedPath, key, property, self })

  checkRecursion({ nestedPath: nestedPathA })

  return runTask({ task, config, plugins, nestedPath: nestedPathA })
}

// Add `error.path` to every thrown error
const recursiveRunTaskHandler = function(error, { nestedPath }, { task: { key }, property, self }) {
  // Only keep deepest `error.path`
  if (error.path === undefined) {
    error.path = appendNestedPath({ nestedPath, key, property, self })
  }

  throw error
}

const eRecursiveRunTask = addErrorHandler(recursiveRunTask, recursiveRunTaskHandler)

const appendNestedPath = function({ nestedPath = [], key, property, self }) {
  // `nestedPath` is unchanged if `self: true`
  // Used when `runTask()` is called to call current task, e.g. by `repeat` plugin
  if (self) {
    return nestedPath
  }

  const nestedPathA = addProperty({ nestedPath, property })

  return [...nestedPathA, { task: key }]
}

// `property` is added to parent task, not current one
const addProperty = function({ nestedPath, property }) {
  if (property === undefined) {
    return nestedPath
  }

  // If first nested task, create a root task with no `task` name
  if (nestedPath.length === 0) {
    return [{ property }]
  }

  const nestedPathA = nestedPath.slice(0, -1)
  const lastPath = nestedPath[nestedPath.length - 1]
  return [...nestedPathA, { ...lastPath, property }]
}

// Check for infinite recursion in `runTask()`
const checkRecursion = function({ nestedPath }) {
  const tasks = nestedPath.map(({ task }) => task)
  const lastTask = tasks[tasks.length - 1]
  const tasksA = tasks.slice(0, -1)
  if (!tasksA.includes(lastTask)) {
    return
  }

  throw new TestOpenApiError(`Infinite task recursion`)
}

const runAllHandler = function(error, { nestedPath }) {
  // Nested `runTask()` errors are propagated
  if (nestedPath !== undefined) {
    throw error
  }

  // Top-level errors are returned as `task.error`
  const { task } = error
  delete error.task

  task.error = error
  return task
}

const eRunAll = addErrorHandler(runAll, runAllHandler)

// Error handler for each plugin handler
// We want to rememeber the current task on the first handler that throws.
// We do this by attaching it to `error.task`, then extracting it on a top-level
// error handler.
// The error is finally set to `task.error`
const runPluginHandler = function(error, task) {
  // Recursive tasks already have `error.task` defined
  if (error.task === undefined) {
    error.task = task
  }

  throw error
}

// Returning `done: true` in any `run` handler stops the iteration but without
// errors (as opposed to throwing an exception)
// This implies successful tasks might be emptier than expected.
// This is used e.g. by `skip|only` or `repeat` plugins
const stopOnDone = function({ done }) {
  return done
}

module.exports = {
  runTask,
}
