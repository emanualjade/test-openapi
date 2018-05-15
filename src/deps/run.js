'use strict'

const { uniq } = require('lodash')

const { checkStack } = require('./stack')

// Run `deps` tests
const runDeps = async function({ test, deps, opts, runTest }) {
  const depKeys = getDepKeys({ deps })
  const depReturns = await Promise.all(
    depKeys.map(depKey => runDep({ depKey, deps, test, opts, runTest })),
  )
  const depReturnsA = Object.assign({}, ...depReturns)
  return depReturnsA
}

// Returns unique set of `deps` for current test
const getDepKeys = function({ deps }) {
  const depKeys = deps.map(({ depKey }) => depKey)
  const depKeysA = uniq(depKeys)
  return depKeysA
}

const runDep = async function({ depKey, deps, test, opts, opts: { tests }, runTest }) {
  const optsA = checkStack({ depKey, deps, test, opts })

  const depTest = tests.find(({ testKey }) => testKey === depKey)
  const depReturn = await runTest({ test: depTest, opts: optsA })
  return { [depKey]: depReturn }
}

module.exports = {
  runDeps,
}
