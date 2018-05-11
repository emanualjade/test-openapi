'use strict'

const { merge } = require('lodash')

const { mergeItems, isObject } = require('../../utils')
const { mergeInvalidSchema } = require('./invalid')
const { mergeShortcutSchema } = require('./shortcut')

// Deep merge parameters or headers with the same name
const mergeInputs = function({ items, isRequest }) {
  return mergeItems({ items, isRequest, merge: mergeInput })
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

module.exports = {
  mergeInputs,
  mergeInput,
}
