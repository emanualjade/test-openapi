'use strict'

const { isMatch } = require('micromatch')

// `config.only: 'glob' or ['glob', ...]` will only run tasks whose name matches
// the globbing patterns
// `task.only: true` will only run those tasks
// Behaves similarly to `skip` plugin
const run = function(
  { only = false, key },
  {
    config: {
      only: { patterns, enabled },
    },
  },
  { isNested },
) {
  // Nested tasks are not skipped
  if (!enabled || isNested || isOnly({ only, patterns, key })) {
    return
  }

  return { done: true, skipped: true }
}

const isOnly = function({ only, patterns, key }) {
  return only || (patterns !== undefined && isMatch(key, patterns))
}

module.exports = {
  run,
}
