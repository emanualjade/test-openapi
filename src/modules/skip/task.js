'use strict'

const { isMatch } = require('micromatch')

// `task.skip: true` will skip those tasks
// Can also use `config.skip: 'glob' or ['glob', ...]`
// Only `task` plugin handlers are skipped, i.e. `start`, `complete` and `end`
// handlers are still run for those tasks.
// This means they will be stopped and reported as `skipped`
const task = function({ skip = false, key }, { config: { skip: patterns } }, { isNested }) {
  // Nested tasks are not skipped
  if (isNested || !isSkipped({ skip, patterns, key })) {
    return
  }

  return { done: true, skipped: true }
}

const isSkipped = function({ skip, patterns, key }) {
  return skip || (patterns !== undefined && isMatch(key, patterns))
}

module.exports = {
  task,
}
