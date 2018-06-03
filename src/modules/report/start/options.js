'use strict'

// Setup reporters' options
const getReportersOptions = function({
  config,
  config: {
    report: { reporters, options },
  },
}) {
  const optionsA = reporters.map(reporter => getReporterOptions({ reporter, config, options }))
  return Object.assign({}, options, ...optionsA)
}

const getReporterOptions = function({ reporter, config, options }) {
  if (reporter.options === undefined) {
    return
  }

  return reporter.options({ config, options })
}

module.exports = {
  getReportersOptions,
}
