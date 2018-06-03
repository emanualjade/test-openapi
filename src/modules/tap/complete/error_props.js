'use strict'

const { omit } = require('lodash')

// Retrieve TAP error properties
const getErrorProps = function({
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
  const errorProps = {
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
  return errorProps
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
  getErrorProps,
}
