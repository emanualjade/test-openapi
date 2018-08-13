'use strict'

const { callReporters } = require('../call')

const { callComplete } = require('./call')

// Reporting for each task.
// We ensure reporting output has same order as tasks definition.
// We do so by buffering each task until its reporting time comes.
const complete = async function(
  task,
  {
    startData,
    startData: {
      report,
      report: { reporters, taskKeys, tasks, index },
    },
    _plugins: plugins,
  },
) {
  // Save current task's result (i.e. reporting input)
  // `startData.report.tasks|index` are stateful and directly mutated because
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
  await callReporters({ reporters, type: 'tick' }, {}, { startData, plugins })

  // Unbuffer tasks, i.e. report them
  await completeTasks({ count, keys, tasks, reporters, startData, plugins })
}

const getCount = function({ keys, tasks }) {
  const count = keys.findIndex(key => tasks[key] === undefined)

  if (count === -1) {
    return keys.length
  }

  return count
}

const completeTasks = async function({ count, keys, tasks, reporters, startData, plugins }) {
  const keysA = keys.slice(0, count)
  await completeTask({ keys: keysA, tasks, reporters, startData, plugins })
}

const completeTask = async function({
  keys: [key, ...keys],
  tasks,
  reporters,
  startData,
  plugins,
}) {
  if (key === undefined) {
    return
  }

  const task = tasks[key]
  await callComplete({ task, reporters, startData, plugins })

  // Async iteration through recursion
  await completeTask({ keys, tasks, reporters, startData, plugins })
}

module.exports = {
  complete,
}
