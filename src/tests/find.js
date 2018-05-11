'use strict'

// Finds all tests
const findTests = function({ spec: { tests = [] } }) {
  return tests
}

module.exports = {
  findTests,
}
