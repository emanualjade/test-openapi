'use strict'

const { callReporters } = require('../call')
const { getLevelData, isSilent } = require('../level')

const { getReporters } = require('./reporters')
const { getReportersOptions } = require('./options')
const { getOutput } = require('./output')

// Starts reporting
const start = async function(allStartData, { config, config: { report = {} } }) {
  const reporters = getReporters({ report })

  const level = getLevelData({ report, reporters })

  const startData = { reporters, level }

  if (isSilent({ startData: { report: startData } })) {
    return { report: startData }
  }

  const options = getReportersOptions({ config, report, reporters })

  const output = await getOutput({ report })

  const ordering = getOrdering({ config })

  const startDataA = { ...startData, options, output, ...ordering }

  await callReporters({ startData: { report: startDataA }, type: 'start' }, config)

  return { report: startDataA }
}

// Used to ensure tasks ordering
const getOrdering = function({ config: { tasks } }) {
  const taskKeys = tasks.map(({ key }) => key)
  return { taskKeys, tasks: {}, index: 0 }
}

module.exports = {
  start,
}
