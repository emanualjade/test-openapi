'use strict'

const { pick } = require('lodash')

// Use TAP output for reporting
const start = function({ tap, report }) {
  const tapA = fixTapConfig({ tap, report })
  return { tap: tapA }
}

// We mirror those properties for convenience, i.e. users do not have to set
// reporting options on two different plugins
const fixTapConfig = function({ tap, report }) {
  const reportA = pick(report, MIRRORED_PROPERTIES)
  return { ...tap, ...reportA }
}

const MIRRORED_PROPERTIES = ['output', 'ordered']

module.exports = {
  start,
}
