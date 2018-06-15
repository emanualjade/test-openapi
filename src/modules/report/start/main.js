'use strict'

const { callReporters } = require('../call')
const { normalizeLevel, isSilent } = require('../level')

const { addOutput } = require('./output')
const { addReporters } = require('./reporters')
const { addReportersOptions } = require('./options')

// Starts reporting
const start = async function(config) {
  const { report = {} } = config

  const reportA = addReporters({ report })

  const reportB = normalizeLevel({ report: reportA })

  if (isSilent({ config: { report: reportB } })) {
    return { report: reportB }
  }

  const reportC = addReportersOptions({ config, report: reportB })

  const reportD = await addOutput({ report: reportC })

  await callReporters({ config: { report: reportD }, type: 'start' }, config)

  const reportE = addOrdering({ config, report: reportD })

  return { report: reportE }
}

// Used to ensure tasks ordering
const addOrdering = function({ config: { tasks }, report }) {
  const taskKeys = tasks.map(({ key }) => key)
  return { ...report, taskKeys, tasks: {}, index: 0 }
}

module.exports = {
  start,
}
