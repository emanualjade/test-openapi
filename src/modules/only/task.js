'use strict'

const { isMatch } = require('micromatch')

const { abortTask } = require('../../errors')

// `config.only: 'glob' or ['glob', ...]` will only run tasks whose name matches
// the globbing patterns
// `task.only: true` will only run those tasks
// Behaves similarly to `skip` plugin
const task = function({
  only = false,
  config: {
    only: { patterns, enabled },
  },
  key,
  isNested,
}) {
  // Nested tasks are not skipped
  if (isNested || !enabled || isOnly({ only, patterns, key })) {
    return
  }

  abortTask()
}

const isOnly = function({ only, patterns, key }) {
  return only || (patterns !== undefined && isMatch(key, patterns))
}

module.exports = {
  task,
}
