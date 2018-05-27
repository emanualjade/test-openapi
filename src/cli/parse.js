'use strict'

const { omit, omitBy } = require('lodash')

const parseConfig = function({ yargs }) {
  const { _: tasks, ...config } = yargs.parse()
  // `yargs`-specific options
  const configA = omit(config, ['help', 'version', '$0'])
  // Remove shortcuts
  const configB = omitBy(configA, (value, name) => name.length === 1)
  const tasksA = tasks.length === 0 ? undefined : tasks
  return { ...configB, tasks: tasksA }
}

module.exports = {
  parseConfig,
}
