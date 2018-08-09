'use strict'

const { serializeOutput } = require('../../tasks')

const { filterTaskData } = require('./level')
const { callReporters } = require('./call')

// Ends reporting
const end = async function(
  tasks,
  {
    startData: {
      report: { reporters },
    },
    _plugins: plugins,
  },
) {
  const tasksA = tasks.map(task => serializeOutput({ task, plugins }))

  const arg = getArg.bind(null, { tasks: tasksA, plugins })

  await callReporters({ reporters, type: 'end' }, arg)
}

const getArg = function({ tasks, plugins }, { options }) {
  const tasksA = tasks.map(task => filterTaskData({ task, options, plugins }))
  return { tasks: tasksA }
}

module.exports = {
  end,
}
