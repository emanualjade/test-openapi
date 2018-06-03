'use strict'

const { Tap } = require('./serializer')

// Set TAP state
const options = function({ config: { tasks } }) {
  const count = tasks.length
  const tap = new Tap({ count })
  return { tap }
}

module.exports = {
  options,
}
