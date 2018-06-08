'use strict'

const { callReporters } = require('../call')

const { addOutput } = require('./output')
const { addReporters } = require('./reporters')
const { addReportersOptions } = require('./options')

// Starts reporting
const start = async function(config) {
  const report = await addOutput({ config })

  const reportA = addReporters({ report })

  const reportB = addReportersOptions({ config, report: reportA })

  await callReporters({ config: { report: reportB }, input: config, type: 'start' })

  const reportC = addOrdering({ config, report: reportB })

  return { report: reportC }
}

// Used to ensure tasks ordering
const addOrdering = function({ config: { tasks }, report }) {
  const taskKeys = tasks.map(({ key }) => key)
  return { ...report, taskKeys, inputs: {}, index: 0 }
}

module.exports = {
  start,
}
