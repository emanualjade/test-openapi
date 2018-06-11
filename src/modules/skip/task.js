'use strict'

const { isMatch } = require('micromatch')

const { abortTask } = require('../../errors')

// `task.skip: true` will skip those tasks
// Can also use `config.skip: 'glob' or ['glob', ...]`
// Only `task` plugin handlers are skipped, i.e. `start`, `complete` and `end`
// handlers are still run for those tasks.
// This means they will be reported (`report` plugin shows them as `skipped`)
// Also they are aborted but considered successful. This implies successful tasks
// might be emptier than expected (if they are skipped).
const skipTask = function({ isNested, skip, key, config }) {
  // Nested tasks are not skipped
  if (!isNested && !isSkipped({ skip, key, config })) {
    return
  }

  abortTask()
}

const isSkipped = function({ skip, key, config: { skip: configSkip } }) {
  return skip || (configSkip !== undefined && isMatch(key, configSkip))
}

module.exports = {
  skipTask,
}
