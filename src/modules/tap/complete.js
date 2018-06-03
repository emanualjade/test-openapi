'use strict'

const { omit } = require('lodash')

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

  const errorA = getError({ error })
  const directive = getDirective({ error })

  return { ok: false, name, error: errorA, directive }
}

const getName = function({ task: { key, titles } }) {
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

const getError = function({
  error: {
    name,
    message,
    stack,
    plugin: operator,
    actual,
    expected,
    schema,
    property,
    task,
    ...error
  },
}) {
  const stackProp = getStackProp({ name, stack })
  const taskA = getTaskProps({ task })
  const errorA = omit(error, NOT_REPORTED_PROPS)

  // Enforce properties order
  const errorB = {
    message,
    operator,
    severity: 'fail',
    actual,
    expected,
    schema,
    property,
    ...stackProp,
    task: taskA,
    ...errorA,
  }
  return errorB
}

const NOT_REPORTED_PROPS = ['config', 'plugins']

// Only report `error.stack` when it's a bug error
const getStackProp = function({ name, stack }) {
  if (name === 'TestOpenApiError') {
    return {}
  }

  return { stack }
}

const getTaskProps = function({ task: { key, ...task } }) {
  const taskA = omit(task, NOT_REPORTED_TASK_PROPS)
  const taskB = getTaskCall({ task: taskA })
  // Enforce properties order
  return { key, ...taskB }
}

const NOT_REPORTED_TASK_PROPS = ['titles']

const getTaskCall = function({
  task: {
    call: {
      request: {
        raw: { method, url, server, path, query, headers },
      },
      response: {
        raw: { status, headers: respHeaders, body },
      },
    },
    ...task
  },
}) {
  // Enforce properties order
  const request = { method, url, server, path, query, headers }
  const response = { status, headers: respHeaders, body }

  return { call: { request, response }, ...task }
}

module.exports = {
  completeTap,
}
