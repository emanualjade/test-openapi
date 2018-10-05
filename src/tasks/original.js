'use strict'

const { omit } = require('lodash')

// Used to keep original task properties as is in return values and reporting
// Does not need to be done before this point, since only used by later
// handlers.
// Does not need to be done later, since `start` handlers cannot modify `tasks`
const addOriginalTasks = function({ tasks }) {
  return tasks.map(task => ({ ...task, originalTask: task }))
}

// `originalTask` is kept only for reporters, but should not be reported nor
// returned
const removeOriginalTasks = function({ tasks }) {
  return tasks.map(task => omit(task, 'originalTask'))
}

module.exports = {
  addOriginalTasks,
  removeOriginalTasks,
}
