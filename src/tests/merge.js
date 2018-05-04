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
  if (inputB.isSetting) {
    return mergeSetting({ input: inputA, setting: inputB })
  }

  return merge(inputA, inputB)
}

// Merge `x-tests.name.*` into requests parameters or response headers
const mergeSetting = function({
  input,
  input: { schema: inputSchema },
  setting,
  setting: { schema: settingSchema },
}) {
  // `x-tests.name.paramName: true` means we re-use parameter's schema
  if (settingSchema === true) {
    return input
  }

  // `x-tests.name.paramName: false` means we inverse re-use parameter's schema
  if (settingSchema === false) {
    return { ...input, schema: { not: inputSchema } }
  }

  // `x-tests.name.paramName: undefined|null` means we do not use that parameter
  if (settingSchema == null) {
    return
  }

  // Otherwise we merge it
  const settingA = omit(setting, 'isSetting')
  return merge({}, input, settingA)
}

module.exports = {
  mergeInputs,
}
