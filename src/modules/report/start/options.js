'use strict'

// Setup reporters' options
const addReportersOptions = function({ config, report }) {
  const options = getReportersOptions({ config, report })
  return { ...report, options }
}

const getReportersOptions = function({ config, report: { reporters, options } }) {
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
  addReportersOptions,
}
