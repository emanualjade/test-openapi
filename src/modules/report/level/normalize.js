'use strict'

// `types` decides whether to show errors, successes, skipped tasks
// `taskData` decided whether to include task.PLUGIN.*
//    - `added` means only the added props (i.e. not in `task.config.task.*`)
const LEVELS = require('./levels')

// Normalize `config.report.level`
// The reporting level should affect individual tasks reporting, not the summary
const normalizeLevel = function({ report, report: { reporters, level } }) {
  const levelA = getLevel({ reporters, level })
  const levelB = LEVELS[levelA]
  return { ...report, level: levelB }
}

// Default `config.report.level` is the first defined `reporter.level`, or `log`
const getLevel = function({ reporters, level }) {
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
  normalizeLevel,
}
