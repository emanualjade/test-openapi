'use strict'

const { uniq } = require('lodash')

const { handleDepError, checkStack } = require('./stack')

// Run `deps` tests
const runDeps = async function({ test, deps, opts, runTest }) {
  const depKeys = getDepKeys({ deps })
  const depReturns = await Promise.all(
    depKeys.map(depKey => runDep({ depKey, test, opts, runTest })),
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

const runDep = async function({ depKey, test, opts, opts: { tests }, runTest }) {
  const optsA = checkStack({ depKey, test, opts })

  const depTest = tests.find(({ testKey }) => testKey === depKey)
  const depReturn = await runDepTest({ depTest, opts: optsA, runTest })
  return { [depKey]: depReturn }
}

const runDepTest = async function({ depTest, opts, runTest }) {
  try {
    return await runTest({ test: depTest, opts })
  } catch (error) {
    handleDepError({ error, opts })
  }
}

module.exports = {
  runDeps,
}