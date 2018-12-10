'use strict'

const { series } = require('gulp')

const FILES = require('../files')
const gulpExeca = require('../exec')

// We do not use `gulp-eslint` because it does not support --cache
// This task also fixes linting errors and apply `prettier` code formatting
const lint = function() {
  const files = FILES.SOURCE.map(pattern => `'${pattern}'`).join(' ')
  return gulpExeca(
    `eslint ${files} --ignore-path .gitignore --fix --cache --format codeframe --max-warnings 0 --report-unused-disable-directives`,
  )
}

// eslint-disable-next-line fp/no-mutation
lint.description = 'Lint source files'

const test = series(lint)

module.exports = {
  lint,
  test,
}
