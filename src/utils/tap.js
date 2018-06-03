'use strict'

const { stdout } = require('process')
const { Stream } = require('stream')

const { isObject } = require('./types')

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

  plan(integer, directive) {
    if (!Number.isInteger(integer)) {
      throw new Error(`tap.plan() first argument must be an integer not ${integer}`)
    }

    const planString = getPlan({ integer })
    const planStringA = addPlanDirective({ planString, integer, directive })
    return this._write(planStringA)
  }

  test(testName) {
    if (typeof testName !== 'string') {
      throw new Error(`tap.test() argument must be a string not ${testName}`)
    }

    return this._write(`# ${testName}`)
  }

  comment(comment) {
    if (typeof comment !== 'string') {
      throw new Error(`tap.comment() argument must be a string not ${comment}`)
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

const addPlanDirective = function({ planString, integer, directive }) {
  const directiveA = getDirective({ directive, integer })

  if (directiveA === undefined) {
    return planString
  }

  if (!isObject(directiveA)) {
    throw new Error(`tap.plan() second argument must be an object not ${directiveA}`)
  }

  const directiveNames = Object.keys(directiveA)
  const [directiveName] = directiveNames

  if (directiveNames.length !== 1 || !DIRECTIVES.includes(directiveName.toLowerCase())) {
    throw new Error(
      `tap.plan() second argument must be an object with a single 'todo' or 'skip' property`,
    )
  }

  const planStringA = `${planString} # ${directiveName.toUpperCase()}`

  const comment = directiveA[directiveName]
  const planStringB = addPlanComment({ planString: planStringA, comment })

  return planStringB
}

const getDirective = function({ directive, integer }) {
  // If no tasks are defined, considered them as skipped
  if (directive === undefined && integer === 0) {
    return { skip: true }
  }

  return directive
}

const DIRECTIVES = ['skip', 'todo']

const addPlanComment = function({ planString, comment }) {
  if (comment === undefined || comment === true) {
    return planString
  }

  if (typeof comment !== 'string') {
    throw new Error(`tap.plan() second argument value must be true or a string not ${comment}`)
  }

  return `${planString} ${comment}`
}

module.exports = {
  Tap,
}
