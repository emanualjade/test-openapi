'use strict'

const { uniq } = require('lodash')

const { addErrorHandler } = require('../../../errors')

const { checkStack, handleDepError, STACK_INFO_SYM } = require('./stack')

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
  const depTaskA = { ...depTask, [STACK_INFO_SYM]: stackInfo }

  const depReturn = await runDepTask(depTaskA)
  return { [depKey]: depReturn }
}

module.exports = {
  runDeps,
}
