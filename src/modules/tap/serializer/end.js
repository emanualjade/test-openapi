'use strict'

const { write } = require('./write')
const { checkArgument } = require('./check')

// Final TAP comments, indicating number of tests|pass|fail|skip
const end = function(comments) {
  checkArgument(comments, 'object')

  const { pass, fail, skip } = getEndComments({ comments })

  const endCommentString = getEndCommentString({ pass, fail, skip })

  return write(this, endCommentString, { newlines: '\n' })
}

const getEndComments = function({ comments }) {
  const [pass, fail, skip] = END_COMMENTS.map(name => getEndComment({ comments, name }))
  return { pass, fail, skip }
}

const END_COMMENTS = ['pass', 'fail', 'skip']

const getEndComment = function({ comments, name }) {
  const count = comments[name] || 0
  checkArgument(count, 'integer')
  return count
}

const getEndCommentString = function({ pass, fail, skip }) {
  const endOk = getEndOk({ fail })

  return `# tests: ${pass + fail + skip}
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
