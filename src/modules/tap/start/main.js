'use strict'

const { tap } = require('../../../utils')

const { getOutput } = require('./output')

// Start TAP v13 output
const startTap = async function({ tap: tapConfig }) {
  const output = await getOutput({ tapConfig })

  tap.version({ output })
}

module.exports = {
  startTap,
}
