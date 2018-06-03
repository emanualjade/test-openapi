'use strict'

const { omit } = require('lodash')

const { convertPlainObject } = require('../../../../errors')
const { getSummary } = require('../../utils')

// JSON reporter
const end = function({ options: { spinner }, tasks }) {
  spinner.stop()

  const report = getReport({ tasks })
  const reportA = JSON.stringify(report, null, 2)
  return reportA
}

const getReport = function({ tasks }) {
  const summary = getSummary({ tasks })
  const tasksA = tasks.map(getTask)

  return { summary, tasks: tasksA }
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