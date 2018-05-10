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
  if (inputB.schema === 'invalid') {
    return mergeInvalidSchema({ inputA, inputB })
  }

  if (!isObject(inputB.schema)) {
    return mergeShortcutSchema({ inputA, inputB })
  }

  // Otherwise it is a JSON schema that we deep merge
  return merge({}, inputA, inputB)
}

// `test.request|response.*: invalid` means we inverse re-use parameter's schema
const mergeInvalidSchema = function({
  inputA,
  inputA: {
    schema,
    schema: { type },
  },
  inputB,
}) {
  const typeA = addNullType({ type })
  const schemaA = { ...schema, type: typeA }
  return { ...inputA, ...inputB, schema: { not: schemaA } }
}

// When using 'invalid', we want to make sure the value is generated, i.e. it
// should never be `null`
const addNullType = function({ type = [] }) {
  if (type === 'null') {
    return type
  }

  if (!Array.isArray(type)) {
    return ['null', type]
  }

  if (type.includes('null')) {
    return type
  }

  return ['null', ...type]
}

// `test.request|response.*: non-object` is shortcut for `{ enum: [value] }`
const mergeShortcutSchema = function({ inputA, inputB }) {
  const type = getSchemaType({ value: inputB.schema })
  return { ...inputA, ...inputB, schema: { ...inputA.schema, type, enum: [inputB.schema] } }
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
