'use strict'

const { Tap } = require('../../../utils')

const { getOutput } = require('./output')

// Start TAP v13 output
const startTap = async function({ tap: tapConfig, tasks }) {
  const output = await getOutput({ tapConfig })

  const tap = new Tap({ output })

  tap.version()

  tap.plan(tasks.length)
}

module.exports = {
  startTap,
}
