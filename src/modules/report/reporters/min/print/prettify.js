'use strict'

const { addErrorHandler } = require('../../../../../errors')

// Prettify JSON, if string is JSON
const prettifyJson = function(string) {
  return JSON.stringify(JSON.parse(string), null, 2)
}

// Try to parse JSON, give up if exception
const prettifyJsonHandler = function(_, string) {
  return string
}

const ePrettifyJson = addErrorHandler(prettifyJson, prettifyJsonHandler)

module.exports = {
  prettifyJson: ePrettifyJson,
}
