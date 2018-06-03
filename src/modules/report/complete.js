'use strict'

const { callReporters } = require('./call')

// Reporting for each task.
// We ensure reporting output has same order as tasks definition.
// We do so by buffering each task until its reporting time comes.
const complete = async function(input) {
  const {
    task: { key },
    config,
    config: {
      report,
      report: { taskKeys, inputs, index },
    },
  } = input

  // Save current task's result (i.e. reporting input)
  // `config.report.inputs|index` are stateful and directly mutated because
  // they need to be shared between parallel tasks
  inputs[key] = input

  // Only use keys not reported yet
  const keys = taskKeys.slice(index)

  // Retrieve how many tasks should now be unbuffered
  const count = getCount({ keys, inputs })

  // Update index to last reported task
  report.index += count

  // Unbuffer tasks, i.e. report them
  await completeTasks({ count, keys, inputs, config })
}

const getCount = function({ keys, inputs }) {
  const count = keys.findIndex(key => inputs[key] === undefined)

  if (count === -1) {
    return keys.length
  }

  return count
}

const completeTasks = async function({ count, keys, inputs, config }) {
  const keysA = keys.slice(0, count)
  await completeTask({ keys: keysA, inputs, config })
}

const completeTask = async function({ keys: [key, ...keys], inputs, config }) {
  if (key === undefined) {
    return
  }

  const input = inputs[key]
  await callReporters({ config, input, type: 'complete' })

  // Async iteration through recursion
  await completeTask({ keys, inputs, config })
}

module.exports = {
  complete,
}
