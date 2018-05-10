'use strict'

const { merge } = require('lodash')

const { isObject } = require('../utils')

// Deep merge parameters or headers with the same name
const mergeInputs = function({ inputs }) {
  return inputs.map(mergeInput).filter(input => input !== undefined)
}

const mergeInput = function(inputA, index, inputs) {
  const nextSameInput = findSameInput(inputs, inputA, index + 1)
  if (nextSameInput !== undefined) {
    return
  }

  const prevSameInput = findSameInput(inputs, inputA, 0, index)
  if (prevSameInput !== undefined) {
    return mergeSingleInput(prevSameInput, inputA)
  }

  return inputA
}

const findSameInput = function(inputs, inputA, start, length) {
  return inputs.slice(start, length).find(inputB => isSameInput({ inputA, inputB }))
}

const isSameInput = function({ inputA, inputB }) {
  return (
    inputA.name.toLowerCase() === inputB.name.toLowerCase() && inputA.location === inputB.location
  )
}

const mergeSingleInput = function(inputA, inputB) {
  // `test.request|response.*: invalid` means we inverse re-use parameter's schema
  if (inputB.schema === 'invalid') {
    return { ...inputA, schema: { not: inputA.schema } }
  }

  // `test.request|response.*: non-object` is shortcut for `{ enum: [value] }`
  if (!isObject(inputB.schema)) {
    const type = getSchemaType({ value: inputB.schema })
    return { ...inputA, schema: { ...inputA.schema, type, enum: [inputB.schema] } }
  }

  // Otherwise it is a JSON schema that we deep merge
  return merge({}, inputA, inputB)
}

// When using the shortcut notation, we need to set the `type` to make sure it
// matches the value (in case it is not set, or set to several types, or set to
// a different type)
const getSchemaType = function({ value }) {
  if (typeof value === 'string') {
    return 'string'
  }

  if (Number.isInteger(value)) {
    return 'integer'
  }

  if (typeof value === 'number') {
    return 'number'
  }

  if (Array.isArray(value)) {
    return 'array'
  }
}

module.exports = {
  mergeInputs,
}
