'use strict'

const { callReporters } = require('../call')

const { addOutput } = require('./output')
const { addReporters } = require('./reporters')
const { addReportersOptions } = require('./options')

// Starts reporting
const start = async function(config) {
  const { report } = config
  const reportA = await addOutput({ report })

  const reportB = addReporters({ report: reportA })

  const reportC = addReportersOptions({ config, report: reportB })

  await callReporters({ config: { report: reportC }, input: config, type: 'start' })

  return { report: reportC }
}

module.exports = {
  start,
}
