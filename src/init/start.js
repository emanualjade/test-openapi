'use strict'

const { runHandlers } = require('../plugins')

const { runTask } = require('./task')

// Run all `start` plugins handlers
const startTasks = async function({ config, plugins }) {
  // `runTask()` can be monkey patched
  const { runTask: mRunTask, ...configA } = await runHandlers(
    { ...config, runTask },
    plugins,
    'start',
  )
  return { config: configA, mRunTask }
}

module.exports = {
  startTasks,
}
