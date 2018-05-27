'use strict'

// Main entry point of tasks definition
const defineTasks = function({ config, errors }) {
  // Define all tasks with `it()`
  describe(DESCRIBE_TITLE, () => defineAllTasks({ config, errors }))
}

const DESCRIBE_TITLE = 'Tasks'

const defineAllTasks = function({ config: { tasks, runTasks, ...config }, errors }) {
  tasks.forEach(task => defineTask({ task, tasks, runTasks, config, errors }))
}

// Define a single task with `it()`
// TODO: fix title when we refactor how reporting is done
// Method and path should be included in titles.
const defineTask = function({ task, task: { taskKey }, tasks, runTasks, config, errors }) {
  // This means `this` context is lost.
  // We can remove the arrow function if we ever need the context.
  // Timeout is handled differently (i.e. not by the runner)
  it(taskKey, () => runTasks({ task, tasks, config, errors }), 0)
}

module.exports = {
  defineTasks,
}
