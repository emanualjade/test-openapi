'use strict'

const { difference } = require('lodash')

const { getModule } = require('../../../modules')

const COMMON_OPTIONS_SCHEMA = require('./common_options_schema')

// Get `startData.report.reporters`
const getReporters = function({ config }) {
  const names = getNames({ config })

  const reporters = names.map(name => getModule({ name, type: 'reporter' }))
  return reporters
}

// Reporters are specified by using their name in `config.report.REPORTER`
const getNames = function({ config: { report = {} } }) {
  const names = Object.keys(report)
  const namesA = difference(names, Object.keys(COMMON_OPTIONS_SCHEMA))

  // When `config.report` is `undefined` or an empty object
  if (namesA.length === 0) {
    return DEFAULT_REPORTERS
  }

  return namesA
}

const DEFAULT_REPORTERS = ['pretty']

module.exports = {
  getReporters,
}
