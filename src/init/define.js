'use strict'

// Main entry point of tasks definition
const defineTasks = function({ config: { runTask, ...config }, plugins, errors }) {
  const readOnlyArgs = getReadOnlyArgs({ config, runTask, plugins, errors })

  // Define all tasks with `it()`
  describe(DESCRIBE_TITLE, () => defineAllTasks({ config, runTask, readOnlyArgs, plugins, errors }))
}

// Passed to every task handler
const getReadOnlyArgs = function({ config, runTask, plugins, errors }) {
  // Pass `runTask` for recursive tasks, with the second argument bound
  // Also tasks can use `isNested` to know if this is a recursive call
  const recursiveRunTask = task => runTask(task, { plugins, readOnlyArgs, errors, isNested: true })

  // Those arguments are passed to each task, but cannot be modified
  const readOnlyArgs = { config, runTask: recursiveRunTask }
  return readOnlyArgs
}

const DESCRIBE_TITLE = 'Tasks'

const defineAllTasks = function({ config: { tasks }, runTask, readOnlyArgs, plugins, errors }) {
  tasks.forEach(task => defineTask({ task, runTask, readOnlyArgs, plugins, errors }))
}

// Define a single task with `it()`
// TODO: fix title when we refactor how reporting is done
// Method and path should be included in titles.
const defineTask = function({ task, task: { taskKey }, runTask, readOnlyArgs, plugins, errors }) {
  // This means `this` context is lost.
  // We can remove the arrow function if we ever need the context.
  // Timeout is handled differently (i.e. not by the runner)
  it(taskKey, () => runTask(task, { readOnlyArgs, plugins, errors }), 0)
}

module.exports = {
  defineTasks,
}
