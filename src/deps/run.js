'use strict'

const { uniq } = require('lodash')

// Run `deps` tests
const runDeps = async function({ deps, opts, runTest }) {
  const depKeys = getDepKeys({ deps })
  const depReturns = await Promise.all(
    depKeys.map(depKey => runDep({ depKey, deps, opts, runTest })),
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

const runDep = async function({ depKey, deps, opts, opts: { tests }, runTest }) {
  const depTest = tests.find(({ testKey }) => testKey === depKey)
  const depReturn = await runDepTest({ depTest, deps, opts, runTest })
  return { [depKey]: depReturn }
}

const runDepTest = async function({ depTest, deps, opts, runTest }) {
  try {
    return await runTest({ test: depTest, opts })
  } catch ({ message }) {
    const error = getDepError({ message, depTest, deps })
    throw error
  }
}

const getDepError = function({ message, depTest, deps }) {
  const { depKey, depPath } = deps.find(({ depKey }) => depKey === depTest.testKey)
  const messageA = `This test targets another test '${depKey}.${depPath}' but this test failed with the following error:\n\n${message}`
  const errorA = new Error(messageA)
  return errorA
}

module.exports = {
  runDeps,
}
