'use strict'

const { getReporterOptions, callReporter } = require('../call')

const { getOutput } = require('./output')
const { loadReporter } = require('./load')
const { validateReporter } = require('./validate')

// Starts reporting
const start = async function({ report, ...config }) {
  const output = await getOutput({ report })
  const reportA = { ...report, output }

  const reporter = getReporter({ report: reportA })
  const reportB = { ...reportA, reporter }
  const configA = { ...config, report: reportB }

  const options = getReporterOptions({ config: configA })
  const reportC = { ...reportB, options }
  const configB = { ...configA, report: reportC }

  await callReporter({ config: configB, input: configB, type: 'start' })

  return { report: reportC }
}

// Retrieve reporter's module's stream
const getReporter = function({ report: { style, options, output } }) {
  if (output === false) {
    return
  }

  const reporter = loadReporter({ style })

  validateReporter({ options, reporter, style })

  return reporter
}

module.exports = {
  start,
}
