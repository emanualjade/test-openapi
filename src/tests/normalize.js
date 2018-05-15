'use strict'

const { addDeps } = require('../deps')

const { addTitles } = require('./title')
const { getOperation } = require('./operation')

// Normalize tests to format easy to work with when tests are running
const normalizeTests = function({ tests, spec }) {
  validateTests({ tests })

  const testsA = Object.entries(tests).map(([testKey, testOpts]) =>
    normalizeTest({ testKey, testOpts, spec }),
  )
  const testsB = addTitles({ tests: testsA })
  const testsC = addDeps({ tests: testsB })
  return testsC
}

const validateTests = function({ tests }) {
  if (Object.keys(tests).length === 0) {
    // type: test
    throw new Error('No tests were found')
  }
}

const normalizeTest = function({ testKey, testOpts, spec }) {
  const { name, operation } = getOperation({ testKey, testOpts, spec })
  return { testKey, testOpts, name, operation }
}

module.exports = {
  normalizeTests,
}
