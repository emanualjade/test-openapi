'use strict'

const { merge, omit } = require('lodash')

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
  // Security parameter
  if (inputA.secName !== undefined) {
    return inputA.secName === inputB.secName
  }

  return (
    inputA.name.toLowerCase() === inputB.name.toLowerCase() && inputA.location === inputB.location
  )
}

const mergeSingleInput = function(inputA, inputB) {
  if (inputB.isTestOpt) {
    return mergeTestOpt({ input: inputA, testOpt: inputB })
  }

  return merge(inputA, inputB)
}

// Merge `x-tests.name.*` into requests parameters or response headers
const mergeTestOpt = function({
  input,
  input: { schema: inputSchema },
  testOpt,
  testOpt: { schema: testSchema },
}) {
  // `x-tests.name.paramName: true` means we re-use parameter's schema
  if (testSchema === true) {
    return input
  }

  // `x-tests.name.paramName: false` means we inverse re-use parameter's schema
  if (testSchema === false) {
    return { ...input, schema: { not: inputSchema } }
  }

  // `x-tests.name.paramName: undefined|null` means we do not use that parameter
  if (testSchema == null) {
    return
  }

  // Otherwise we merge it
  const testOptA = omit(testOpt, 'isTestOpt')
  return merge({}, input, testOptA)
}

module.exports = {
  mergeInputs,
}
