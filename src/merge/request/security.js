'use strict'

const { mergeInputs } = require('../common')

// Get list of authentication-related headers or query variables
const getSecChoices = function({ operation, testRequest }) {
  const { secTestRequest, testRequest: testRequestA } = getSecTestRequest({ testRequest })

  const secChoices = getChoices({ operation, secTestRequest })

  return { testRequest: testRequestA, secChoices }
}

const getSecTestRequest = function({ testRequest }) {
  const secTestRequest = testRequest.filter(({ location }) => location === 'security')
  const testRequestA = testRequest.filter(({ location }) => location !== 'security')
  return { secTestRequest, testRequest: testRequestA }
}

// OpenAPI specification allows an alternative of sets of authentication-related
// request parameters, so `request` is an array of arrays.
// We only keep security alternatives that have been directly specified in `test.request.security.*`
const getChoices = function({ operation: { security }, secTestRequest }) {
  const secChoices = security
    .map(secRequest => addSecTestRequest({ secRequest, secTestRequest }))
    .filter(secRequest => secRequest !== undefined)

  // Means no security parameters will be used
  if (secChoices.length === 0) {
    return [[]]
  }

  return secChoices
}

const addSecTestRequest = function({ secRequest, secTestRequest }) {
  const secTestRequestA = normalizeSecTestRequest({ secTestRequest, secRequest })

  // Only use security request parameters if specified in `test.request.security`
  if (secTestRequestA.length === 0) {
    return
  }

  const secRequestA = mergeSecTestRequest({ secRequest, secTestRequest: secTestRequestA })
  return secRequestA
}

// Find security parameter for each `test.request.security.SEC_NAME` and merge
// it except `schema`
const normalizeSecTestRequest = function({ secTestRequest, secRequest }) {
  return secTestRequest
    .map(secTestParam => normalizeSecTestParam({ secTestParam, secRequest }))
    .filter(secTestParam => secTestParam !== undefined)
}

const normalizeSecTestParam = function({ secTestParam: { name, schema }, secRequest }) {
  const secParam = secRequest.find(({ secName }) => secName === name)
  if (secParam === undefined) {
    return
  }

  return { ...secParam, schema }
}

// Merge `test.request.security`
const mergeSecTestRequest = function({ secRequest, secTestRequest }) {
  const items = [...secRequest, ...secTestRequest]
  const secRequestA = mergeInputs({ items })
  return secRequestA
}

module.exports = {
  getSecChoices,
}
