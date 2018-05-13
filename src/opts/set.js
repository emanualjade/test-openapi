'use strict'

const OPTS_SYM = Symbol('opts')

// Test files are `require()`'d by Jasmine.
// So we need to pass information to them by setting global variables
const setOpts = function(opts) {
  global[OPTS_SYM] = opts
}

const getOpts = function() {
  return global[OPTS_SYM]
}

const unsetOpts = function() {
  delete global[OPTS_SYM]
}

module.exports = {
  setOpts,
  getOpts,
  unsetOpts,
}
