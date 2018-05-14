'use strict'

const { loadTestFiles } = require('./files')
const { normalizeTests } = require('./normalize')

// Load `tests` option from test files, then normalize it
const loadTests = async function({ tests, spec }) {
  const testsA = await loadTestFiles({ tests })

  validateTests({ tests: testsA })

  const testsB = normalizeTests({ tests: testsA, spec })
  return testsB
}

const validateTests = function({ tests }) {
  if (Object.keys(tests).length === 0) {
    throw new Error('No tests were found')
  }
}

module.exports = {
  loadTests,
}
