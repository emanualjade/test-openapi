'use strict'

const { callReporters } = require('../call')

const { getOutput } = require('./output')
const { loadReporter } = require('./load')
const { validateReporter } = require('./validate')
const { getReportersOptions } = require('./options')

// Starts reporting
const start = async function({ report, ...config }) {
  const output = await getOutput({ report })
  const reportA = { ...report, output }

  const reporters = getReporters({ report: reportA })
  const reportB = { ...reportA, reporters }
  const configA = { ...config, report: reportB }

  const options = getReportersOptions({ config: configA })
  const reportC = { ...reportB, options }
  const configB = { ...configA, report: reportC }

  await callReporters({ config: configB, input: configB, type: 'start' })

  return { report: reportC }
}

// Retrieve reporters' modules
const getReporters = function({ report: { styles, options, output } }) {
  if (output === false) {
    return []
  }

  return styles.map(style => getReporter({ style, options }))
}

const getReporter = function({ style, options }) {
  const reporter = loadReporter({ style })

  validateReporter({ options, reporter, style })

  return reporter
}

module.exports = {
  start,
}
