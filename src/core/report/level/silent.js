import { getResultType } from '../utils/result_type.js'

// When using `config.report.REPORTER.level: silent`, whole run is silent
export const isSilent = function({
  options: {
    level: { types },
  },
}) {
  return types.length === 0
}

// Some `config.report.REPORTER.level` will only show errors, i.e. see if task
// should be silent
export const isSilentTask = function({ task, options }) {
  const resultType = getResultType(task)
  return isSilentType({ resultType, options })
}

// When reporters only show summary (e.g. `notify`), we silent summary according
// to `config.report.REPORTER.level`
export const isSilentType = function({
  resultType,
  options: {
    level: { types },
  },
}) {
  return !types.includes(resultType)
}
