'use strict'

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
  const arg = getArg.bind(null, { tasks, plugins })

  await callReporters({ reporters, type: 'end' }, arg)
}

const getArg = function({ tasks, plugins }, { options }) {
  const tasksA = tasks.map(task => filterTaskData({ task, options, plugins }))
  return { tasks: tasksA }
}

module.exports = {
  end,
}
