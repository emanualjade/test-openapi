'use strict'

const { Stream } = require('stream')
const { stdout } = require('process')

// Write to output
const write = function({ output = stdout }, string, { newlines = '\n\n' } = {}) {
  if (output === false) {
    return string
  }

  if (!(output instanceof Stream)) {
    throw new Error('new Tap() options.output must be a stream')
  }

  output.write(`${string}${newlines}`)
}

// Closes stream
const close = function() {
  const { output } = this

  if (output === false || output === stdout) {
    return
  }

  output.destroy()
}

module.exports = {
  write,
  close,
}
