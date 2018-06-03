'use strict'

const { pick } = require('lodash')

const { loadReporter } = require('./load')
const { validateReporter, validateOptions } = require('./validate')

// Use TAP output for reporting
const start = function({ tap, report }) {
  const tapA = fixTapConfig({ tap, report })
  const reporter = getReporter({ report })
  return { tap: { ...tapA, reporter } }
}

// We mirror those properties for convenience, i.e. users do not have to set
// reporting options on two different plugins
const fixTapConfig = function({ tap, report }) {
  const reportA = pick(report, MIRRORED_PROPERTIES)
  return { ...tap, ...reportA }
}

const MIRRORED_PROPERTIES = ['output', 'ordered']

// Retrieve reporter's module's stream
const getReporter = function({ report: { style, options } }) {
  if (style === undefined) {
    return
  }

  const reporterModule = loadReporter({ style })

  validateReporter({ reporterModule, style })

  const { report, config = {} } = reporterModule

  validateOptions({ options, config, style })

  // `reporter.report()` should not throw
  const reporter = report.bind(null, options)
  return reporter
}

module.exports = {
  start,
}
