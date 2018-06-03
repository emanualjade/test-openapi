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

  _write(string, { newlines = '\n\n' } = {}) {
    if (!this.output) {
      return string
    }

    this.output.write(`${string}${newlines}`)
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

  plan(count, directive) {
    checkArgument('plan', count, 'integer')

    const planString = getPlan({ count })
    const planStringA = addPlanDirective({ planString, count, directive })
    return this._write(planStringA)
  }

  test(testName) {
    checkArgument('test', testName, 'string')

    return this._write(`# ${testName}`)
  }

  comment(comment) {
    checkArgument('comment', comment, 'string')

    return this._write(`# ${comment}`)
  }

  end(comments) {
    checkArgument('end', comments, 'object')

    const [pass, fail, skip] = END_COMMENTS.map(name => getEndComment({ comments, name }))

    const endComment = `# tests: ${pass + fail + skip}
# pass: ${pass}
# fail: ${fail}
# skip: ${skip}`
    const endCommentA = addEndOk({ endComment, fail })

    return this._write(endCommentA, { newlines: '\n' })
  }
}

const addEndOk = function({ endComment, fail }) {
  if (fail !== 0) {
    return endComment
  }

  return `${endComment}\n# ok`
}

const getPlan = function({ count }) {
  if (count === 0) {
    return '0..0'
  }

  return `1..${String(count)}`
}

const addPlanDirective = function({ planString, count, directive }) {
  const directiveA = getDirective({ directive, count })

  if (directiveA === undefined) {
    return planString
  }

  checkArgument('plan', directiveA, 'object')

  const directiveNames = Object.keys(directiveA)
  const [directiveName] = directiveNames

  if (directiveNames.length !== 1 || !DIRECTIVES.includes(directiveName.toLowerCase())) {
    throw new Error(`tap.plan() argument must be an object with a single 'todo' or 'skip' property`)
  }

  const planStringA = `${planString} # ${directiveName.toUpperCase()}`

  const comment = directiveA[directiveName]
  const planStringB = addPlanComment({ planString: planStringA, comment })

  return planStringB
}

const getDirective = function({ directive, count }) {
  // If no tasks are defined, considered them as skipped
  if (directive === undefined && count === 0) {
    return { skip: true }
  }

  return directive
}

const DIRECTIVES = ['skip', 'todo']

const addPlanComment = function({ planString, comment }) {
  if (comment === undefined || comment === true) {
    return planString
  }

  checkArgument('plan', comment, 'string')

  return `${planString} ${comment}`
}

const END_COMMENTS = ['pass', 'fail', 'skip']

const getEndComment = function({ comments, name }) {
  const count = comments[name] || 0
  checkArgument('end', count, 'integer')
  return count
}

const checkArgument = function(name, value, type) {
  const isValid = TYPES[type](value)
  if (isValid) {
    return
  }

  throw new Error(`tap.${name}() argument must be ${type} not ${value}`)
}

const TYPES = {
  string(value) {
    return typeof value === 'string'
  },

  integer: Number.isInteger,

  object: isObject,
}

module.exports = {
  Tap,
}
