'use strict'

const { loadTestFiles } = require('./files')
const { loadNormalizedSpec } = require('../spec')

// We cannot run this is in parallel because `loadNormalizedSpec()` changes `process.cwd`
// TODO: fix
const loadOpts = async function({ spec, tests, ...opts }) {
  // Retrieve test files
  const testsA = await loadTestFiles({ tests })

  // Retrieve OpenAPI specification
  const specA = await loadNormalizedSpec({ path: spec })

  return { ...opts, spec: specA, tests: testsA }
}

module.exports = {
  loadOpts,
}
