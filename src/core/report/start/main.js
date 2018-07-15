'use strict'

const { callReporters } = require('../call')

const { getReporters } = require('./reporters')
const { addOptions } = require('./options')

// Starts reporting
const start = async function(allStartData, { config }) {
  const reporters = getReporters({ config })

  const reportersA = await addOptions({ reporters, config })

  const ordering = getOrdering({ config })

  await callReporters({ reporters: reportersA, type: 'start' }, config)

  return { report: { reporters: reportersA, ...ordering } }
}

// Used to ensure tasks ordering
const getOrdering = function({ config: { tasks } }) {
  const taskKeys = tasks.map(({ key }) => key)
  return { taskKeys, tasks: {}, index: 0 }
}

module.exports = {
  start,
}
