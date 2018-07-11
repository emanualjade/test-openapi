'use strict'

// Get `startData.report.options`
const getReportersOptions = function({ config, report, reporters }) {
  const optionsA = reporters.map(reporter => getReporterOptions({ config, report, reporter }))
  return Object.assign({}, ...optionsA)
}

const getReporterOptions = function({
  reporter,
  reporter: { name },
  config,
  report: { options: { [name]: options = {} } = {} },
}) {
  const optionsA = getOptions({ reporter, config, options })
  const optionsB = { ...options, ...optionsA }

  return { [name]: optionsB }
}

const getOptions = function({ reporter, config, options }) {
  if (reporter.options === undefined) {
    return
  }

  return reporter.options({ config, options })
}

module.exports = {
  getReportersOptions,
}
