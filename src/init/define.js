'use strict'

const { runTasks } = require('./run')

// Main entry point of tasks definition
const defineTasks = function({ config, errors }) {
  // Define all tasks with `it()`
  describe(DESCRIBE_TITLE, () => defineAllTasks({ config, errors }))
}

const DESCRIBE_TITLE = 'Tasks'

const defineAllTasks = function({ config, config: { tasks }, errors }) {
  tasks.map(task => defineTask({ task, config, errors }))
}

// Define a single task with `it()`
const defineTask = function({ task: { title, ...task }, config, errors }) {
  // This means `this` context is lost.
  // We can remove the arrow function if we ever need the context.
  // Timeout is handled differently (i.e. not by the runner)
  it(title, () => runTasks({ task: { ...task, config }, errors }), 0)
}

module.exports = {
  defineTasks,
}
