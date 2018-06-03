'use strict'

const { constructor: Chalk } = require('chalk')

// Used for colored output
// `opts.colors: false` can be used to disable it
// By default, it guesses (e.g. no colors if output is redirected)
const getColors = function({ colors }) {
  const opts = getChalkOpts({ colors })
  const chalk = new Chalk(opts)
  return chalk
}

const getChalkOpts = function({ colors }) {
  if (colors !== false) {
    return {}
  }

  return { enabled: false }
}

module.exports = {
  getColors,
}
