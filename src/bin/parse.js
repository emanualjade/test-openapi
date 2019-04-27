import { omit, omitBy } from 'lodash'

export const parseConfig = function({ yargs }) {
  const { _: tasks, ...config } = yargs.parse()

  // `yargs`-specific options
  const configA = omit(config, ['help', 'version', '$0'])

  // Remove shortcuts
  const configB = omitBy(configA, (value, name) => name.length === 1)

  const tasksA = tasks.length === 0 ? undefined : tasks
  const configC = { ...configB, tasks: tasksA }
  return configC
}
