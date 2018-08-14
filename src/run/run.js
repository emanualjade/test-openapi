'use strict'

const { addErrorHandler, TestOpenApiError } = require('../errors')
const { runHandlers, getTaskReturn } = require('../plugins')

// Run each `plugin.run()`
const runTask = async function({ task, context, plugins, nestedPath }) {
  const taskA = await eRunAll({ task, context, plugins, nestedPath })

  const taskB = getTaskReturn({ task: taskA, plugins })
  return taskB
}

const runAll = function({ task, task: { skipped }, context, plugins, nestedPath }) {
  // Task marked as skipped, e.g. by `skip|only` plugins
  // Only `run` plugin handlers are skipped, i.e. `start`, `complete` and `end`
  // handlers are still run for those tasks.
  // This means they will be stopped and reported as `skipped`
  // Can still be used by as nested tasks
  if (skipped && nestedPath === undefined) {
    return task
  }

  const contextA = getContext({ context, plugins, nestedPath })

  return runHandlers({
    type: 'run',
    plugins,
    input: task,
    context: contextA,
    errorHandler: runPluginHandler,
    stopFunc,
  })
}

// Top-level errors are returned as `task.error`
// From `error: { task }` to `task: { error }`
const runAllHandler = function(error) {
  const { task } = error

  delete error.task
  task.error = error

  return task
}

const eRunAll = addErrorHandler(runAll, runAllHandler)

const getContext = function({ context, plugins, nestedPath }) {
  const recursiveRunTaskA = recursiveRunTask.bind(null, { context, plugins, nestedPath })

  const contextA = { ...context, _runTask: recursiveRunTaskA, _nestedPath: nestedPath }
  return contextA
}

// Pass simplified `_runTask()` for recursive tasks
// Tasks can use `_nestedPath` to know if this is a recursive call
// As opposed to regular `_runTask()`, failed task throws.
const recursiveRunTask = async function(
  { context, plugins, nestedPath },
  { task, task: { key }, self, getError },
) {
  checkRecursion({ nestedPath, key, self })

  const nestedPathA = appendNestedPath({ nestedPath, key, self })

  const taskA = await runTask({ task, context, plugins, nestedPath: nestedPathA })

  const { error } = taskA

  if (error === undefined) {
    return taskA
  }

  throwRecursiveError({ task: taskA, error, getError })
}

// Check for infinite recursion in `_runTask()`
// This is separate from template recursion check:
//  - template check recursions only within a given task
//  - tasks recursion can happen even without any templating involved
//    (when any plugin uses `_runTask()`)
const checkRecursion = function({ nestedPath = [], key, self }) {
  if (self || !nestedPath.includes(key)) {
    return
  }

  const cycle = [...nestedPath, key].join(`\n ${RIGHT_ARROW} `)
  throw new TestOpenApiError(`Infinite task recursion:\n   ${cycle}`)
}

const RIGHT_ARROW = '\u21aa'

const appendNestedPath = function({ nestedPath = [], key, self }) {
  // `_nestedPath` is unchanged if `self: true`
  // Used when `_runTask()` is called to call current task, e.g. by `repeat` plugin
  if (self) {
    return nestedPath
  }

  return [...nestedPath, key]
}

// When `getError()` is undefined, the nested error is propagated as is.
// When `getError()` is specified, we throw that error instead but with
// `error.nested` set to the nested task.
// This can be done recursively, leading to a chain of `error.nested`
const throwRecursiveError = function({ task, error, getError }) {
  if (getError === undefined) {
    error.task = task
    throw error
  }

  // Each nested task re-creates a new error, ensuring `error.task|plugin|etc.`
  // are set each time
  const topError = getError()

  topError.nested = { ...task, error }

  throw topError
}

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
const stopFunc = function({ done }) {
  return done
}

module.exports = {
  runTask,
}
