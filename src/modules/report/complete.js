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
    startData,
    startData: {
      report,
      report: { taskKeys, tasks, index },
    },
    _plugins: plugins,
  },
) {
  if (isSilent({ startData })) {
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

  // `reporter.tick()` is like `reporter.complete()` except it is not buffered.
  // I.e. meant for example to increment a progress bar or spinner. Doing this
  // in `reporter.complete()` would make progress bar be buffered, which would
  // make it look it's stalling.
  // However we do want to buffer `reporter.complete()`, as reporters like TAP
  // add indexes on each task, i.e. need to be run in output order.
  // `reporter.tick()` does not get task as input.
  await callReporters({ startData, type: 'tick' }, {}, { config, startData, plugins })

  // Unbuffer tasks, i.e. report them
  await completeTasks({ count, keys, tasks, config, startData, plugins })
}

const getCount = function({ keys, tasks }) {
  const count = keys.findIndex(key => tasks[key] === undefined)

  if (count === -1) {
    return keys.length
  }

  return count
}

const completeTasks = async function({ count, keys, tasks, config, startData, plugins }) {
  const keysA = keys.slice(0, count)
  await completeTask({ keys: keysA, tasks, config, startData, plugins })
}

const completeTask = async function({ keys: [key, ...keys], tasks, config, startData, plugins }) {
  if (key === undefined) {
    return
  }

  const task = tasks[key]
  await callComplete({ task, config, startData, plugins })

  // Async iteration through recursion
  await completeTask({ keys, tasks, config, startData, plugins })
}

const callComplete = async function({
  task,
  task: { error: { nested } = {} },
  config,
  startData,
  plugins,
}) {
  const silent = isSilentTask({ task, startData })

  const taskA = filterTaskData({ task, startData, plugins })

  await callReporters({ startData, type: 'complete' }, taskA, {
    config,
    startData,
    plugins,
    silent,
  })

  if (nested === undefined) {
    return
  }

  // Recurse over `task.error.nested`
  await callComplete({ task: { ...nested, isNested: true }, config, startData, plugins })
}

module.exports = {
  complete,
}
