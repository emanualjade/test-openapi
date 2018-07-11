'use strict'

// `types` decides whether to show errors, successes, skipped tasks
// `taskData` decided whether to include task.PLUGIN.*
//    - `added` means only the added props (i.e. not in `task.config.task.*`)
const LEVELS = require('./levels')

// Get `startData.report.level`
// The reporting level should affect individual tasks reporting, not the summary
const getLevelData = function({ report: { level }, reporters }) {
  const levelA = getLevel({ level, reporters })
  const levelB = LEVELS[levelA]
  return levelB
}

// Default `startData.report.level` is the first defined `reporter.level`, or `log`
const getLevel = function({ level, reporters }) {
  if (level !== undefined) {
    return level
  }

  const reporterLevel = reporters.map(({ level }) => level).find(level => level !== undefined)
  if (reporterLevel !== undefined) {
    return reporterLevel
  }

  return DEFAULT_LEVEL
}

const DEFAULT_LEVEL = 'info'

module.exports = {
  getLevelData,
}
