'use strict'

const { merge } = require('lodash')

const { mergeValues } = require('../../utils')
const { isObject } = require('../../utils')
const { mergeInvalidSchema } = require('./invalid')
const { mergeShortcutSchema } = require('./shortcut')

// Deep merge parameters or headers with the same name
const mergeInputs = function({ inputs }) {
  return mergeValues(inputs, mergeInput, isSameInput)
}

// Deep merge a `test.*.*` value with the specification value
const mergeInput = function(inputA, inputB) {
  if (inputB.schema === 'invalid') {
    return mergeInvalidSchema({ inputA, inputB })
  }

  if (!isObject(inputB.schema)) {
    return mergeShortcutSchema({ inputA, inputB })
  }

  // Otherwise it is a JSON schema that we deep merge
  return merge({}, inputA, inputB)
}

const isSameInput = function(inputA, inputB) {
  return (
    inputA.name.toLowerCase() === inputB.name.toLowerCase() && inputA.location === inputB.location
  )
}

module.exports = {
  mergeInputs,
  mergeInput,
}
