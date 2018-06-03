'use strict'

const { Stream } = require('stream')
const { stdout } = require('process')

// Write to output
const write = function({ output = stdout }, string, { newlines = '\n\n', end = false } = {}) {
  if (output === false) {
    return string
  }

  if (!(output instanceof Stream)) {
    throw new Error('new Tap() options.output must be a stream')
  }

  output.write(`${string}${newlines}`)

  if (end && output !== stdout) {
    output.destroy()
  }
}

module.exports = {
  write,
}
