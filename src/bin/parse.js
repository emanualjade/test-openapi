import { omit, omitBy } from 'lodash'

const parseConfig = function({ yargs }) {
  // eslint-disable-next-line id-length
  const { _: tasks, ...config } = yargs.parse()

  // `yargs`-specific options
  const configA = omit(config, ['help', 'version', '$0'])

  // Remove shortcuts
  const configB = omitBy(configA, (value, name) => name.length === 1)

  const tasksA = tasks.length === 0 ? undefined : tasks
  const configC = { ...configB, tasks: tasksA }
  return configC
}

module.exports = {
  parseConfig,
}
