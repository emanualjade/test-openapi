'use strict'

const { Tap } = require('../../../utils')

const { getOutput } = require('./output')

// Start TAP v13 output
const startTap = async function({ tap, tasks }) {
  const output = await getOutput({ tap })

  const writer = new Tap({ output })

  const tasksCount = tasks.length

  writer.version()

  writer.plan(tasksCount)

  if (tasksCount !== 0) {
    writer.test('Tasks')
  }

  return { tap: { ...tap, writer } }
}

module.exports = {
  startTap,
}
