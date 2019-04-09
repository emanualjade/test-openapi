const { serializeOutput } = require('../../serialize')

const { filterTaskData } = require('./level')
const { callReporters } = require('./call')

// Ends reporting
const end = async function(tasks, context) {
  const {
    startData: {
      report: { reporters },
    },
    _plugins: plugins,
  } = context

  const tasksA = tasks.map(task => serializeOutput({ task, plugins }))

  const arg = getArg.bind(null, { tasks: tasksA, plugins })

  await callReporters({ reporters, type: 'end' }, arg, context)
}

const getArg = function({ tasks, plugins }, { options }) {
  return tasks.map(task => filterTaskData({ task, options, plugins }))
}

module.exports = {
  end,
}
