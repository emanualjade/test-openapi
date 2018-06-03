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

const getReporterOptions = function({ reporter, reporter: { name }, config, options }) {
  if (reporter.options === undefined) {
    return
  }

  const optionsA = options[name] || {}
  const optionsB = reporter.options({ config, options: optionsA })
  return { [name]: { ...optionsA, ...optionsB } }
}

module.exports = {
  getReportersOptions,
}
