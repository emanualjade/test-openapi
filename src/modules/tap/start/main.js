'use strict'

const { Tap } = require('../serializer')

const { getOutput } = require('./output')

// Start TAP v13 output
const startTap = async function({ tap, tasks }) {
  const output = await getOutput({ tap })

  const count = tasks.length

  const writer = new Tap({ output, count })

  return { tap: { ...tap, writer } }
}

module.exports = {
  startTap,
}
