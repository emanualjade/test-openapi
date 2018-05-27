'use strict'

const Jasmine = require('jasmine')
const { SpecReporter } = require('jasmine-spec-reporter')

const { addGenErrorHandler, createTaskError } = require('../errors')

const { defineTasks } = require('./define')

// Run Jasmine with `**/*.js` as the task files
const launchRunner = async function({ config }) {
  await new Promise(launchJasmine.bind(null, config))
}

const eLaunchRunner = addGenErrorHandler(launchRunner, ({ config }) => ({ config }))

const launchJasmine = function(config, resolve, reject) {
  const runner = new Jasmine()

  runner.loadConfig(JASMINE_CONFIG)

  runner.env.clearReporters()
  runner.env.addReporter(new SpecReporter())

  // Collect task errors since Jasmine does not return them
  const errors = []

  runner.onComplete(onComplete.bind(null, resolve, reject, errors))

  // Instead of calling `describe()` and `it()` when the task files are `require()`'d,
  // we defer it to now.
  // I.e. `spec_files` is an empty array and we manually call the define function.
  // The reason is:
  //  - it allows us to do a top-level `require()` instead of the dynamic
  //    one Jasmine is doing.
  //    This has several advantages, including allowing the files to be available
  //    in Chrome devtools.
  //  - it allows us passing `config` as argument (instead of using a global variable
  //    which would make running several `launchRunner` impossible)
  defineTasks({ config, errors })

  runner.execute()
}

const JASMINE_CONFIG = {
  spec_files: [],
}

// Make Jasmine return a promise
const onComplete = function(resolve, reject, errors, passed) {
  if (passed && errors.length === 0) {
    return resolve()
  }

  const error = createTaskError({ errors })
  reject(error)
}

module.exports = {
  launchRunner: eLaunchRunner,
}
