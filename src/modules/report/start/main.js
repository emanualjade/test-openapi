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

  const reportD = addOrdering({ config, report: reportC })

  return { report: reportD }
}

// Used to ensure tasks ordering
const addOrdering = function({ config: { tasks }, report }) {
  const taskKeys = tasks.map(({ key }) => key)
  return { ...report, taskKeys, inputs: {}, index: 0 }
}

module.exports = {
  start,
}
