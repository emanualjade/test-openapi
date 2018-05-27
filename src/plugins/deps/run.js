'use strict'

const { uniq } = require('lodash')

const { addErrorHandler } = require('../../errors')

const { checkStack, handleDepError } = require('./stack')

// Run `deps` tasks
const runDeps = async function({ task, runTask }) {
  const runDepTask = addErrorHandler(runTask, handleDepError)

  const depKeys = getDepKeys({ task })
  const depReturns = depKeys.map(depKey => runDep({ task, depKey, runDepTask }))
  const depReturnsA = await Promise.all(depReturns)
  const depReturnsB = Object.assign({}, ...depReturnsA)
  return depReturnsB
}

// Returns unique set of `deps` for current task
const getDepKeys = function({
  task: {
    dep: { refs },
  },
}) {
  const depKeys = refs.map(({ depKey }) => depKey)
  const depKeysA = uniq(depKeys)
  return depKeysA
}

const runDep = async function({
  task: {
    config: { tasks, dry },
    taskKey,
    dep,
  },
  depKey,
  runDepTask,
}) {
  const stackInfo = checkStack({ depKey, taskKey, dep })

  if (dry) {
    return {}
  }

  const depTask = tasks.find(({ taskKey }) => taskKey === depKey)
  const depTaskA = { ...depTask, dep: { ...depTask.dep, ...stackInfo } }

  const depReturn = await runDepTask(depTaskA)
  return { [depKey]: depReturn }
}

module.exports = {
  runDeps,
}
