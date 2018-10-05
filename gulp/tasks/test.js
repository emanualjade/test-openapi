'use strict'

const { series } = require('gulp')

const FILES = require('../files')
const { execCommand } = require('../utils')

// We do not use `gulp-eslint` because it does not support --cache
// This task also fixes linting errors and apply `prettier` code formatting
const lint = function() {
  const sources = FILES.SOURCE.join(' ')
  const command = `eslint ${sources} --ignore-path .gitignore --fix --cache --format codeframe --max-warnings 0 --report-unused-disable-directives`

  return execCommand(command)
}

// eslint-disable-next-line fp/no-mutation
lint.description = 'Lint source files'

const test = series(lint)

module.exports = {
  lint,
  test,
}
