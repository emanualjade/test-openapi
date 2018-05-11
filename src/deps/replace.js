'use strict'

// Replace all `deps`, i.e. references to other tests.
const replaceDeps = async function({ tests, test, test: { depKeys }, runTest, opts }) {
  const depsReturns = await Promise.all(
    depKeys.map(depKey => replaceDep({ depKey, tests, runTest, opts })),
  )
  return test
}

const replaceDep = async function({ depKey, tests, runTest, opts }) {
  const depTest = tests.find(({ testKey }) => testKey === depKey)
  const depReturn = await runTest({ tests, test: depTest, opts })
}

module.exports = {
  replaceDeps,
}
