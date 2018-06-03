'use strict'

const { Tap } = require('../../../utils')

const { getOutput } = require('./output')

// Start TAP v13 output
const startTap = async function({ tap, tasks }) {
  const output = await getOutput({ tap })

  const writer = new Tap({ output })

  writer.version()

  writer.plan(tasks.length)

  return { tap: { ...tap, writer } }
}

module.exports = {
  startTap,
}
