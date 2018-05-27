'use strict'

const { omit, omitBy } = require('lodash')

const parseConfig = function({ yargs }) {
  const { _: tasks, plugin: plugins, ...config } = yargs.parse()
  const configA = { ...config, plugins }

  // `yargs`-specific options
  const configB = omit(configA, ['help', 'version', '$0'])

  // Remove shortcuts
  const configC = omitBy(configB, (value, name) => name.length === 1)

  const tasksA = tasks.length === 0 ? undefined : tasks
  const configD = { ...configC, tasks: tasksA }

  const configE = omitBy(configD, value => value === undefined)
  return configE
}

module.exports = {
  parseConfig,
}
