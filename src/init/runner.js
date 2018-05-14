'use strict'

const Jasmine = require('jasmine')
const { SpecReporter } = require('jasmine-spec-reporter')

const { defineTests } = require('../define')

// Run Jasmine with `**/*.js` as the test files
const launchRunner = function(resolve, reject) {
  const jasmine = new Jasmine()

  jasmine.loadConfig(JASMINE_CONFIG)

  jasmine.env.clearReporters()
  jasmine.env.addReporter(new SpecReporter())

  jasmine.onComplete(onComplete.bind(null, resolve, reject))

  // Instead of calling `describe()` and `it()` when the test files are `require()`'d,
  // we defer it to now.
  // I.e. `spec_files` is an empty array and we manually call the define function.
  // The reason is it allows us to do a top-level `require()` instead of the dynamic
  // one Jasmine is doing.
  // This has several advantages, including allowing the files to be available
  // in Chrome devtools.
  defineTests()

  jasmine.execute()
}

const JASMINE_CONFIG = {
  spec_files: [],
  stopSpecOnExpectationFailure: true,
}

// Make Jasmine return a promise
const onComplete = function(resolve, reject, passed) {
  if (passed) {
    return resolve()
  }

  reject(new Error(ERROR_MESSAGE))
}

const ERROR_MESSAGE = 'some tests failed'

module.exports = {
  launchRunner,
}
