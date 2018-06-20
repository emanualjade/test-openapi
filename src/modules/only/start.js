'use strict'

// Check if `config|task.only` is used, so we know whether to perform an `only` run
const start = function({ only: patterns, tasks }) {
  const enabled = patterns !== undefined || tasks.some(({ only }) => only !== undefined)
  return { only: { patterns, enabled } }
}

module.exports = {
  start,
}
