'use strict'

const { uniq } = require('lodash')

const { addErrorHandler } = require('../../../errors')

const { checkStack, handleDepError } = require('./stack')

// Run `deps` tasks
const runDeps = async function({ task, tasks, refs, runTask }) {
  const runDepTask = addErrorHandler(runTask, handleDepError)

  const depKeys = getDepKeys({ refs })

  const depReturns = depKeys.map(depKey => runDep({ task, tasks, refs, depKey, runDepTask }))
  const depReturnsA = await Promise.all(depReturns)
  const depReturnsB = Object.assign({}, ...depReturnsA)

  return depReturnsB
}

// Returns unique set of `deps` for current task
const getDepKeys = function({ refs }) {
  const depKeys = refs.map(({ depKey }) => depKey)
  const depKeysA = uniq(depKeys)
  return depKeysA
}

const runDep = async function({ task, tasks, refs, depKey, runDepTask }) {
  const stackInfo = checkStack({ depKey, task, refs })

  const depTask = tasks.find(({ taskKey }) => taskKey === depKey)
  // `task.deps` will only be used|returned in `dep` tasks
  const depTaskA = { ...depTask, deps: stackInfo }

  const depReturn = await runDepTask(depTaskA)
  return { [depKey]: depReturn }
}

module.exports = {
  runDeps,
}
