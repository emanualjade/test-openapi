'use strict'

// Add TAP output for each task, as a single assert
const completeTap = function({
  task,
  error,
  config: {
    tap: { writer },
  },
}) {
  const taskA = getTask({ task, error })
  const assert = getAssert({ task: taskA, error })

  writer.assert(assert)
}

const getTask = function({ task, error }) {
  if (task !== undefined) {
    return task
  }

  return error.task
}

const getAssert = function({ task, error }) {
  const name = getName({ task })

  if (error === undefined) {
    return { ok: true, name }
  }

  const { skipped } = error
  const skip = skipped === true
  const directive = { skip }

  return { ok: false, name, directive }
}

const getName = function({ task: { key, titles } }) {
  if (titles.length === 0) {
    return key
  }

  const titlesA = titles.join(' ')
  return `${key} - ${titlesA}`
}

module.exports = {
  completeTap,
}
