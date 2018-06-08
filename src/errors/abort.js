'use strict'

// Abort a task (during `task` handler) by throwing an error
// Aborted tasks are considered successful, i.e. if this error gets propagated,
// this is a bug, i.e. we use a normal `Error`.
// This is used e.g. by the `skip` plugin
const abortTask = function() {
  const error = new Error('Aborted task')
  error.aborted = true
  throw error
}

module.exports = {
  abortTask,
}
