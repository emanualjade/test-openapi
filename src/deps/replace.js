'use strict'

const { set, merge } = require('lodash')

const { get } = require('../utils')

const { runDeps } = require('./run')

// Replace all `deps`, i.e. references to other tests.
const replaceDeps = async function({ test, test: { deps }, opts, runTest }) {
  if (deps.length === 0) {
    return test
  }

  const depReturns = await runDeps({ test, deps, opts, runTest })
  const depsA = deps.map(dep => replaceDep({ dep, depReturns }))
  const testA = mergeDeps({ test, deps: depsA })
  return testA
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

const mergeDeps = function({ test, test: { testOpts }, deps }) {
  const testOptsA = merge({}, testOpts, ...deps)
  return { ...test, testOpts: testOptsA }
}

module.exports = {
  replaceDeps,
}
