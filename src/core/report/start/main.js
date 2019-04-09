const { callReporters } = require('../call')

const { getReporters } = require('./reporters')
const { addOptions } = require('./options')

// Starts reporting
const start = async function(startData, context) {
  const { config } = context

  const reporters = getReporters({ config })

  const reportersA = await addOptions({ reporters, config, context })

  const ordering = getOrdering(context)

  await callReporters(
    { reporters: reportersA, type: 'start' },
    undefined,
    context,
  )

  return { report: { reporters: reportersA, ...ordering } }
}

// Used to ensure tasks ordering
const getOrdering = function({ _tasks: tasks }) {
  const taskKeys = tasks.map(({ key }) => key)
  return { taskKeys, tasks: {}, index: 0 }
}

module.exports = {
  start,
}
