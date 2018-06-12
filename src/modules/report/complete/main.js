'use strict'

const { callReporters } = require('../call')

const { getTitle } = require('./title')
const { getErrorProps } = require('./error_props')

// Reporting for each task.
// We ensure reporting output has same order as tasks definition.
// We do so by buffering each task until its reporting time comes.
const complete = async function(task) {
  const {
    key,
    config,
    config: {
      report,
      report: { taskKeys, tasks, index },
    },
    plugins,
  } = task

  const taskA = addProps({ task, plugins })

  // Save current task's result (i.e. reporting input)
  // `config.report.inputs|index` are stateful and directly mutated because
  // they need to be shared between parallel tasks
  tasks[key] = taskA

  // Only use keys not reported yet
  const keys = taskKeys.slice(index)

  // Retrieve how many tasks should now be unbuffered
  const count = getCount({ keys, tasks })

  // Update index to last reported task
  report.index += count

  // Unbuffer tasks, i.e. report them
  await completeTasks({ count, keys, tasks, config })
}

// Add plugin-specific `task.title` and `task.errorProps`
const addProps = function({ task, plugins }) {
  const title = getTitle({ task, plugins })
  const errorProps = getErrorProps({ plugins })
  return { ...task, title, errorProps }
}

const getCount = function({ keys, tasks }) {
  const count = keys.findIndex(key => tasks[key] === undefined)

  if (count === -1) {
    return keys.length
  }

  return count
}

const completeTasks = async function({ count, keys, tasks, config }) {
  const keysA = keys.slice(0, count)
  await completeTask({ keys: keysA, tasks, config })
}

const completeTask = async function({ keys: [key, ...keys], tasks, config }) {
  if (key === undefined) {
    return
  }

  const task = tasks[key]
  await callReporters({ config, input: task, type: 'complete' })

  // Async iteration through recursion
  await completeTask({ keys, tasks, config })
}

module.exports = {
  complete,
}
