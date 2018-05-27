'use strict'

const { runTasks } = require('./run')

// Main entry point of tasks definition
const defineTasks = function({ config, errors }) {
  // Define all tasks with `it()`
  describe(DESCRIBE_TITLE, () => defineAllTasks({ config, errors }))
}

const DESCRIBE_TITLE = 'Tasks'

const defineAllTasks = function({ config: { tasks, ...config }, errors }) {
  // Allow each task to access `task.config`
  const tasksA = tasks.map(task => ({ ...task, config }))

  tasksA.forEach(task => defineTask({ task, tasks: tasksA, errors }))
}

// Define a single task with `it()`
// TODO: fix title when we refactor how reporting is done
// Method and path should be included in titles.
const defineTask = function({ task, task: { taskKey }, tasks, errors }) {
  // This means `this` context is lost.
  // We can remove the arrow function if we ever need the context.
  // Timeout is handled differently (i.e. not by the runner)
  it(taskKey, () => runTasks({ task, tasks, errors }), 0)
}

module.exports = {
  defineTasks,
}
