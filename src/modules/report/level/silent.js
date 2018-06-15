'use strict'

const { getResultType } = require('../utils')

// When using `config.report.level: silent`, whole run is silent
const isSilent = function({
  config: {
    report: {
      level: { types },
    },
  },
}) {
  return types.length === 0
}

// Some `config.report.level` will only show errors, i.e. see if task should be silent
const isSilentTask = function({
  task,
  config: {
    report: {
      level: { types },
    },
  },
}) {
  const resultType = getResultType(task)
  return !types.includes(resultType)
}

// When reporters only show summary (e.g. `notify`), we silent summary according
// to `config.report.level`
const isSilentSummary = function({
  resultType,
  config: {
    report: {
      level: { types },
    },
  },
}) {
  return !types.includes(resultType)
}

module.exports = {
  isSilent,
  isSilentTask,
  isSilentSummary,
}
