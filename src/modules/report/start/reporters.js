'use strict'

const { loadReporter } = require('./load')
const { validateReporter } = require('./validate')

// Get `startData.reporters`
const getReporters = function({ report: { styles = DEFAULT_REPORTERS, options = {} } }) {
  return styles.map(style => getReporter({ style, options }))
}

const DEFAULT_REPORTERS = ['pretty']

const getReporter = function({ style, options }) {
  const reporter = loadReporter({ style })

  validateReporter({ options, reporter, style })

  return reporter
}

module.exports = {
  getReporters,
}
