'use strict'

const { addDeps } = require('../deps')

const { validateTests } = require('./validate')
const { mergeEach } = require('./each')
const { addTitles } = require('./title')
const { getOperation } = require('./operation')

// Normalize tests to format easy to work with when tests are running
const normalizeTests = function({ tests, spec }) {
  validateTests({ tests })

  const testsA = mergeEach({ tests })

  const testsB = Object.entries(testsA).map(([testKey, testOpts]) =>
    normalizeTest({ testKey, testOpts, spec }),
  )
  const testsC = addTitles({ tests: testsB })
  const testsD = addDeps({ tests: testsC })
  return testsD
}

const normalizeTest = function({ testKey, testOpts, spec }) {
  const { name, operation } = getOperation({ testKey, testOpts, spec })
  return { testKey, testOpts, name, operation }
}

module.exports = {
  normalizeTests,
}
