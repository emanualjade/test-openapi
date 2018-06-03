'use strict'

const { getErrorProps } = require('./error_props')

// Add TAP output for each task, as a single assert
const completeTap = function({
  task,
  error,
  config: {
    tap: { writer },
  },
}) {
  const assert = getAssert({ task, error })
  writer.assert(assert)
}

const getAssert = function({ task, error }) {
  const taskA = getTask({ task, error })

  const { key } = taskA
  const ok = error === undefined
  const name = getAssertName({ task: taskA })

  if (ok) {
    return { key, ok, name }
  }

  const errorProps = getErrorProps({ error })
  const directive = getDirective({ error })

  return { key, ok, name, error: errorProps, directive }
}

const getTask = function({ task, error }) {
  if (task !== undefined) {
    return task
  }

  return error.task
}

// Get assert name using `task.key` and `task.titles`
const getAssertName = function({ task: { key, titles } }) {
  if (titles.length === 0) {
    return key
  }

  const titlesA = titles.join(' ')
  return `${key} - ${titlesA}`
}

const getDirective = function({ error: { skipped } }) {
  const skip = skipped === true
  return { skip }
}

module.exports = {
  completeTap,
}
