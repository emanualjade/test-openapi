'use strict'

const { uniq } = require('lodash')

const { addErrorHandler } = require('../../errors')

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

const runDep = async function({ task: { taskKey, stackInfo }, tasks, refs, depKey, runDepTask }) {
  const stackInfoA = checkStack({ depKey, taskKey, refs, stackInfo })

  const depTask = tasks.find(({ taskKey }) => taskKey === depKey)
  const depTaskA = { ...depTask, stackInfo: stackInfoA }

  const depReturn = await runDepTask(depTaskA)
  return { [depKey]: depReturn }
}

module.exports = {
  runDeps,
}
