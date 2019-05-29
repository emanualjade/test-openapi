#!/usr/bin/env node
import { exit } from 'process'

import { run } from '../main.js'

import { defineCli } from './top.js'
import { parseConfig } from './parse.js'

// Parse CLI arguments then run tasks
const runCli = async function() {
  try {
    const yargs = defineCli()
    const config = parseConfig({ yargs })
    const tasks = await run(config)
    return tasks
  } catch (error) {
    runCliHandler(error)
  }
}

// If an error is thrown, print error's description, then exit with exit code 1
const runCliHandler = function(error) {
  const { tasks, message } = error instanceof Error ? error : new Error(error)

  // Do not print error message if the error happened during task running, as
  // it's already been reported using `report`
  if (tasks === undefined) {
    console.error(message)
  }

  exit(1)
}

runCli()
