'use strict'

const { getResultType } = require('../utils')

// When using `config.report.level: silent`, whole run is silent
const isSilent = function({
  startData: {
    report: {
      level: { types },
    },
  },
}) {
  return types.length === 0
}

// Some `config.report.level` will only show errors, i.e. see if task should be silent
const isSilentTask = function({ task, startData }) {
  const resultType = getResultType(task)
  return isSilentType({ resultType, startData })
}

// When reporters only show summary (e.g. `notify`), we silent summary according
// to `config.report.level`
const isSilentType = function({
  resultType,
  startData: {
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
  isSilentType,
}
