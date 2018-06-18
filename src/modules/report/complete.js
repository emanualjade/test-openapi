'use strict'

const { callReporters } = require('./call')
const { isSilent, isSilentTask, filterTaskData } = require('./level')

// Reporting for each task.
// We ensure reporting output has same order as tasks definition.
// We do so by buffering each task until its reporting time comes.
const complete = async function(
  task,
  {
    config,
    config: {
      report,
      report: { taskKeys, tasks, index },
    },
  },
  { plugins },
) {
  if (isSilent({ config })) {
    return
  }

  // Save current task's result (i.e. reporting input)
  // `config.report.inputs|index` are stateful and directly mutated because
  // they need to be shared between parallel tasks
  tasks[task.key] = task

  // Only use keys not reported yet
  const keys = taskKeys.slice(index)

  // Retrieve how many tasks should now be unbuffered
  const count = getCount({ keys, tasks })

  // Update index to last reported task
  report.index += count

  // Unbuffer tasks, i.e. report them
  await completeTasks({ count, keys, tasks, config, plugins })
}

const getCount = function({ keys, tasks }) {
  const count = keys.findIndex(key => tasks[key] === undefined)

  if (count === -1) {
    return keys.length
  }

  return count
}

const completeTasks = async function({ count, keys, tasks, config, plugins }) {
  const keysA = keys.slice(0, count)
  await completeTask({ keys: keysA, tasks, config, plugins })
}

const completeTask = async function({ keys: [key, ...keys], tasks, config, plugins }) {
  if (key === undefined) {
    return
  }

  const task = tasks[key]
  await callComplete({ task, config, plugins })

  // Async iteration through recursion
  await completeTask({ keys, tasks, config, plugins })
}

const callComplete = async function({ task, config, plugins }) {
  const silent = isSilentTask({ task, config })

  const taskA = filterTaskData({ task, config, plugins })

  await callReporters({ config, type: 'complete' }, taskA, { config, plugins, silent })
}

module.exports = {
  complete,
}
