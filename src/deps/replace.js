'use strict'

const { set, merge, uniq } = require('lodash')

// Replace all `deps`, i.e. references to other tests.
const replaceDeps = async function({ test, test: { deps }, opts, runTest }) {
  if (deps.length === 0) {
    return test
  }

  const depReturns = await getDepReturns({ deps, opts, runTest })
  const depsA = deps.map(dep => replaceDep({ dep, depReturns }))
  const testA = mergeDeps({ test, deps: depsA })
  return testA
}

const getDepReturns = async function({ deps, opts, runTest }) {
  const depKeys = getDepKeys({ deps })
  const depReturns = await Promise.all(
    depKeys.map(depKey => getDepReturn({ depKey, opts, runTest })),
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

const getDepReturn = async function({ depKey, opts, opts: { tests }, runTest }) {
  const depTest = tests.find(({ testKey }) => testKey === depKey)
  const depReturn = await runTest({ test: depTest, opts })
  return { [depKey]: depReturn }
}

const replaceDep = function({ dep: { depKey, depPath, path }, depReturns }) {
  const depReturn = depReturns[depKey]
  const depValue = getDepValue({ depKey, depReturn, depPath })
  const depValueA = set({}, path, depValue)
  return depValueA
}

const getDepValue = function({ depKey, depReturn, depPath }) {
  try {
    return get(depReturn, depPath)
  } catch (error) {
    throw new Error(
      `This test targets another test '${depKey}.${depPath}' but this key could not be found`,
    )
  }
}

// Like Lodash get() except works with objects that have keys with dots in them
const get = function(obj, path) {
  if (!path.includes('.') || obj[path] !== undefined) {
    return obj[path]
  }

  const keyA = Object.keys(obj).find(key => path.startsWith(`${key}.`))
  if (keyA === undefined) {
    throw new Error(`Could not find key named '${path}'`)
  }

  const pathA = path.replace(`${keyA}.`, '')
  return get(obj[keyA], pathA)
}

const mergeDeps = function({ test, test: { testOpts }, deps }) {
  const testOptsA = merge({}, testOpts, ...deps)
  return { ...test, testOpts: testOptsA }
}

module.exports = {
  replaceDeps,
}
