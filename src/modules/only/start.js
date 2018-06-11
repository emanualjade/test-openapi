'use strict'

// Check if `config|task.only` is used, so we know whether to perform an `only` run
const checkOnlyRun = function({ only: patterns, tasks }) {
  const enabled = patterns !== undefined || tasks.some(({ only }) => only)
  return { only: { patterns, enabled } }
}

module.exports = {
  checkOnlyRun,
}
