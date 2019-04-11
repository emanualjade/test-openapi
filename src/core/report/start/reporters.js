import { difference, omitBy } from 'lodash'

import { getModule } from '../../../modules.js'

// eslint-disable-next-line import/no-namespace
import * as COMMON_OPTIONS_SCHEMA from './common_options_schema'
// eslint-disable-next-line import/no-namespace
import * as REPORTER_SCHEMA from './reporter_schema'

// Get `startData.report.reporters`
export const getReporters = function({ config }) {
  const names = getNames({ config })

  const reporters = names.map(name => getModule(name, MODULE_OPTS))
  return reporters
}

// Reporters are specified by using their name in `config.report.REPORTER`
const getNames = function({ config: { report = {} } }) {
  const reportA = omitBy(report, value => value === undefined)
  const names = Object.keys(reportA)
  const namesA = difference(names, Object.keys(COMMON_OPTIONS_SCHEMA))

  // When `config.report` is `undefined` or an empty object
  if (namesA.length === 0) {
    return DEFAULT_REPORTERS
  }

  return namesA
}

const DEFAULT_REPORTERS = ['pretty']

const MODULE_OPTS = {
  title: 'reporter',
  modulePrefix: 'test-openapi-reporter-',
  corePath: `${__dirname}/../reporters/`,
  props: ({ name }) => ({ property: `config.report.${name}` }),
  schema: REPORTER_SCHEMA,
}
