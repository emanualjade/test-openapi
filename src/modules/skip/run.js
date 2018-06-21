'use strict'

const { isMatch } = require('micromatch')

// `task.skip: anyValue` will skip those tasks
// Can also use `config.skip: 'glob' or ['glob', ...]`
// Only `run` plugin handlers are skipped, i.e. `start`, `complete` and `end`
// handlers are still run for those tasks.
// This means they will be stopped and reported as `skipped`
const run = function({ skip, key }, { config: { skip: patterns } }, { nestedPath }) {
  // Nested tasks are not skipped
  if (nestedPath !== undefined || !isSkipped({ skip, patterns, key })) {
    return
  }

  return { done: true, skipped: true }
}

// Any value in `task.skip` will be same as `true`. This is because helpers
// are not evaluated yet, so we can't assume what the value is. But we still want
// the `skip` plugin to be performed before helpers evaluation, as helpers
// evaluation takes some time.
const isSkipped = function({ skip, patterns, key }) {
  return skip !== undefined || (patterns !== undefined && isMatch(key, patterns))
}

module.exports = {
  run,
}
