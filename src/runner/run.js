'use strict'

const Jasmine = require('jasmine')
const { SpecReporter } = require('jasmine-spec-reporter')

// Run Jasmine with `**/*.js` as the test files
const runTests = function(resolve, reject) {
  const jasmine = new Jasmine()

  jasmine.loadConfig(JASMINE_CONFIG)

  jasmine.env.clearReporters()
  jasmine.env.addReporter(new SpecReporter())

  jasmine.onComplete(onComplete.bind(null, resolve, reject))
  jasmine.execute()
}

const JASMINE_CONFIG = {
  spec_files: [`${__dirname}/../define.js`],
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
  runTests,
}
