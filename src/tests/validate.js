'use strict'

const { throwTestError } = require('../errors')
const { validateFromSchema } = require('../utils')

const TEST_SCHEMA = require('./schema')

// Validate syntax of test files
const validateTests = function({ tests }) {
  validateEmptyTests({ tests })

  Object.entries(tests).forEach(validateTest)
}

const validateEmptyTests = function({ tests }) {
  if (Object.keys(tests).length !== 0) {
    return
  }

  throwTestError('No tests were found')
}

const validateTest = function([testName, test]) {
  const { error, path } = validateFromSchema({ schema: TEST_SCHEMA, value: test, name: testName })
  if (error === undefined) {
    return
  }

  throwTestError(`Test '${testName}' is invalid: ${error}`, { test: testName, property: path })
}

module.exports = {
  validateTests,
}
