'use strict'

const { stdout } = require('process')
const { Stream } = require('stream')

// TAP serializer
class Tap {
  constructor({ output = stdout } = {}) {
    if (!(output instanceof Stream) && output !== false) {
      throw new Error('new Tap() options.output must be a stream')
    }

    Object.assign(this, { output })
  }

  _write(string) {
    if (!this.output) {
      return string
    }

    this.output.write(`${string}\n`)
  }

  close() {
    if (this.output === false || this.output === stdout) {
      return
    }

    this.output.destroy()
  }

  version() {
    return this._write('TAP version 13')
  }

  plan(integer) {
    if (!Number.isInteger(integer)) {
      throw new Error(`tap.plan() argument must be an integer, not ${integer}`)
    }

    const planString = getPlan({ integer })
    return this._write(planString)
  }

  test(testName) {
    if (typeof testName !== 'string') {
      throw new Error(`tap.test() argument must be a string, not ${testName}`)
    }

    return this._write(`# ${testName}`)
  }

  comment(comment) {
    if (typeof comment !== 'string') {
      throw new Error(`tap.comment() argument must be a string, not ${comment}`)
    }

    return this._write(`# ${comment}`)
  }
}

const getPlan = function({ integer }) {
  if (integer === 0) {
    return '0..0'
  }

  return `1..${String(integer)}`
}

module.exports = {
  Tap,
}
