'use strict'

const { Tap } = require('../serializer')

const { getOutput } = require('./output')

// Start TAP v13 output
const startTap = async function({ tap, tasks }) {
  const output = await getOutput({ tap })

  const orderedInput = getOrderedInput({ tap, tasks })
  const writer = new Tap({ output, ...orderedInput })

  return { tap: { ...tap, writer } }
}

// If `config.tap.ordered: true`, TAP output will follow tasks order,
// even if they are run in parallel
const getOrderedInput = function({ tap: { ordered }, tasks }) {
  if (!ordered) {
    return { count: tasks.length }
  }

  const keys = tasks.map(({ key }) => key)
  return { keys }
}

module.exports = {
  startTap,
}
