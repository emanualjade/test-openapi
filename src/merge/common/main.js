'use strict'

const { merge } = require('lodash')

const { mergeValues, isObject } = require('../../utils')

const { mergeInvalidSchema } = require('./invalid')
const { mergeShortcutSchema } = require('./shortcut')

// Merge request parameters of same name and location
const mergeRequest = function(request, mergeFunc) {
  return mergeValues(request, isSameParam, mergeFunc)
}

// Merge response headers of same name
const mergeResponse = function(headers, mergeFunc) {
  return mergeValues(headers, isSameHeader, mergeFunc)
}

const isSameParam = function(paramA, paramB) {
  if (paramA.location !== paramB.location) {
    return false
  }

  if (paramA.location === 'header') {
    return paramA.name.toLowerCase() === paramB.name.toLowerCase()
  }

  return paramA.name === paramB.name
}

const isSameHeader = function(inputA, inputB) {
  return inputA.name.toLowerCase() === inputB.name.toLowerCase()
}

// Same as above but for merging test options and specification
const mergeTestRequest = function(request) {
  return mergeRequest(request, mergeTestOpt)
}

const mergeTestResponse = function(headers) {
  return mergeResponse(headers, mergeTestOpt)
}

// Deep merge a `test.*.*` value with the specification value
const mergeTestOpt = function(
  { schema: specSchema, ...specValue },
  { schema: testSchema, ...testValue },
) {
  const schema = mergeTestSchema({ specSchema, testSchema })
  return { ...specValue, ...testValue, schema }
}

const mergeTestSchema = function({ specSchema, testSchema }) {
  if (testSchema === 'invalid') {
    return mergeInvalidSchema({ specSchema, testSchema })
  }

  if (!isObject(testSchema)) {
    return mergeShortcutSchema({ specSchema, testSchema })
  }

  // Otherwise it is a JSON schema that we deep merge
  return merge({}, specSchema, testSchema)
}

module.exports = {
  mergeRequest,
  mergeResponse,
  mergeTestRequest,
  mergeTestResponse,
  mergeTestSchema,
  isSameParam,
  isSameHeader,
}
