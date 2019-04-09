import { callReporters } from '../call.js'

import { callComplete } from './call.js'

// Reporting for each task.
// We ensure reporting output has same order as tasks definition.
// We do so by buffering each task until its reporting time comes.
export const complete = async function(task, context) {
  const {
    startData: {
      report,
      report: { reporters, taskKeys, tasks, index },
    },
    _plugins: plugins,
  } = context

  // Save current task's result (i.e. reporting input)
  // `startData.report.tasks|index` are stateful and directly mutated because
  // they need to be shared between parallel tasks
  // eslint-disable-next-line fp/no-mutation
  tasks[task.key] = task

  // Only use keys not reported yet
  const keys = taskKeys.slice(index)

  // Retrieve how many tasks should now be unbuffered
  const count = getCount({ keys, tasks })

  // Update index to last reported task
  // eslint-disable-next-line fp/no-mutation
  report.index += count

  // `reporter.tick()` is like `reporter.complete()` except it is not buffered.
  // I.e. meant for example to increment a progress bar or spinner. Doing this
  // in `reporter.complete()` would make progress bar be buffered, which would
  // make it look it's stalling.
  // However we do want to buffer `reporter.complete()`, as reporters like TAP
  // add indexes on each task, i.e. need to be run in output order.
  // `reporter.tick()` does not get task as input.
  await callReporters({ reporters, type: 'tick' }, undefined, context)

  // Unbuffer tasks, i.e. report them
  await completeTasks({ count, keys, tasks, reporters, plugins, context })
}

const getCount = function({ keys, tasks }) {
  const count = keys.findIndex(key => tasks[key] === undefined)

  if (count === -1) {
    return keys.length
  }

  return count
}

const completeTasks = async function({
  count,
  keys,
  tasks,
  reporters,
  plugins,
  context,
}) {
  const keysA = keys.slice(0, count)
  await completeTask({ keys: keysA, tasks, reporters, plugins, context })
}

const completeTask = async function({
  keys: [key, ...keys],
  tasks,
  reporters,
  plugins,
  context,
}) {
  if (key === undefined) {
    return
  }

  const task = tasks[key]
  await callComplete({ task, reporters, plugins, context })

  // Async iteration through recursion
  await completeTask({ keys, tasks, reporters, plugins, context })
}
