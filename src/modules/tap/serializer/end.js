'use strict'

const { write } = require('./write')

// Final TAP comments, indicating number of tests|pass|fail|skip
const end = function() {
  const endCommentString = getEndCommentString(this)

  return write(this, endCommentString, { newlines: '\n', end: true })
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
