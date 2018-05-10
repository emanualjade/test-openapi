'use strict'

const { merge } = require('lodash')

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
  // `test.request|response.*: true` means we re-use parameter's schema
  if (inputB.schema === true) {
    return inputA
  }

  // `test.request|response.*: false` means we inverse re-use parameter's schema
  if (inputB.schema === false) {
    return { ...inputA, schema: { not: inputA.schema } }
  }

  // `test.request|response.*: undefined|null` means we do not use that parameter
  if (inputB.schema == null) {
    return
  }

  return merge({}, inputA, inputB)
}

module.exports = {
  mergeInputs,
}
