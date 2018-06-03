'use strict'

const { omit } = require('lodash')

const { convertPlainObject } = require('../../../../errors')

// JSON/YAML reporter
const end = function({ tasks }) {
  const report = getReport({ tasks })
  const reportA = JSON.stringify(report, null, 2)
  return reportA
}

const getReport = function({ tasks }) {
  const summary = getSummary({ tasks })
  const tasksA = tasks.map(getTask)

  return { summary, tasks: tasksA }
}

const getSummary = function({ tasks }) {
  const total = tasks.length
  const fail = tasks.filter(isFailedTask).length
  const skip = tasks.filter(isSkippedTask).length
  const pass = total - fail - skip
  const ok = fail === 0

  return { ok, total, fail, pass, skip }
}

const isFailedTask = function({ error }) {
  return error !== undefined && !error.skipped
}

const isSkippedTask = function({ error }) {
  return error !== undefined && error.skipped
}

const getTask = function({ task, error }) {
  const errorA = getError({ error })
  return { ...task, error: errorA }
}

const getError = function({ error }) {
  if (error === undefined) {
    return
  }

  const errorA = convertPlainObject(error)
  const errorB = omit(errorA, ['task'])
  return errorB
}

module.exports = {
  end,
}
