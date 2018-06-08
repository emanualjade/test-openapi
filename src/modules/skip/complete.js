'use strict'

const { abortTask } = require('../../errors')

// `task.skip: true` will skip those tasks
// Only `task` plugin handlers are skipped, i.e. `start`, `complete` and `end`
// handlers are still run for those tasks.
// This means they will be reported (`report` plugin shows them as `skipped`)
// Also they are aborted but considered successful. This implies successful tasks
// might be emptier than expected (if they are skipped).
const skipTask = function({ skip }) {
  if (!skip) {
    return
  }

  abortTask()
}

module.exports = {
  skipTask,
}
