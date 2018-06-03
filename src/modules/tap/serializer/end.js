'use strict'

const { getPlanString } = require('./plan')
const { write } = require('./write')

// Final TAP comments, indicating number of tests|pass|fail|skip
const end = function() {
  const { pass, fail, skip, count: initialCount } = this
  const count = pass + fail + skip

  const planString = getPlan({ initialCount, count })

  const endCommentString = getEndCommentString({ pass, fail, skip, count })

  const endComment = [...planString, endCommentString].join('\n\n')

  return write(this, endComment, { newlines: '\n', end: true })
}

// Add final plan if not initially specified
const getPlan = function({ initialCount, count }) {
  if (initialCount !== undefined) {
    return []
  }

  const planString = getPlanString({ count })
  return [planString]
}

const getEndCommentString = function({ pass, fail, skip, count }) {
  const endOk = getEndOk({ fail })

  return `# tests: ${count}
# pass: ${pass}
# fail: ${fail}
# skip: ${skip}${endOk}`
}

// Add # ok final comment if no test failed
const getEndOk = function({ fail }) {
  if (fail !== 0) {
    return ''
  }

  return `\n# ok`
}

module.exports = {
  end,
}
