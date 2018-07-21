'use strict'

const { merge } = require('../../template')

// Merge `config.each` to all tasks
// It is like the `glob` plugin with a task named `*` except it is set on `config`
// instead of as a task, making it easier for the user to specify.
// We are not validating `config.each` (except that it is an object) because
// the `verify` plugin will do that instead.
// Merged properties will be part of `originalTask`, i.e. will be reported as
// if they were specified directly in the task (like the `glob` plugin).
const load = function(tasks, { config: { each } }) {
  if (each === undefined) {
    return
  }

  // Deep merged with lower priority than `task` (but higher than `glob` plugin)
  return tasks.map(task => merge({}, each, task))
}

module.exports = {
  load,
}
