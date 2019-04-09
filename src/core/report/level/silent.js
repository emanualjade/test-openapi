import { getResultType } from '../utils.js'

// When using `config.report.REPORTER.level: silent`, whole run is silent
const isSilent = function({
  options: {
    level: { types },
  },
}) {
  return types.length === 0
}

// Some `config.report.REPORTER.level` will only show errors, i.e. see if task
// should be silent
const isSilentTask = function({ task, options }) {
  const resultType = getResultType(task)
  return isSilentType({ resultType, options })
}

// When reporters only show summary (e.g. `notify`), we silent summary according
// to `config.report.REPORTER.level`
const isSilentType = function({
  resultType,
  options: {
    level: { types },
  },
}) {
  return !types.includes(resultType)
}

module.exports = {
  isSilent,
  isSilentTask,
  isSilentType,
}
