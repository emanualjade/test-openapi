'use strict'

const { tap } = require('../../../utils')

const { getOutput } = require('./output')

// Start TAP v13 output
const startTap = async function({ tap: tapConfig, tasks }) {
  const output = await getOutput({ tapConfig })

  tap.version({ output })

  tap.plan(tasks.length, { output })
}

module.exports = {
  startTap,
}
