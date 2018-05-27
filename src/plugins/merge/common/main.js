'use strict'

const { merge } = require('lodash')

const { mergeValues, isObject } = require('../../../utils')

const { mergeInvalidSchema } = require('./invalid')
const { mergeShortcutSchema } = require('./shortcut')

// Merge request parameters of same name and location
const mergeParams = function(params, mergeFunc) {
  return mergeValues(params, isSameParam, mergeFunc)
}

// Merge response headers of same name
const mergeResponse = function(headers, mergeFunc) {
  return mergeValues(headers, isSameHeader, mergeFunc)
}

const isSameParam = function(paramA, paramB) {
  if (paramA.location !== paramB.location) {
    return false
  }

  if (paramA.location === 'headers') {
    return paramA.name.toLowerCase() === paramB.name.toLowerCase()
  }

  return paramA.name === paramB.name
}

const isSameHeader = function(inputA, inputB) {
  return inputA.name.toLowerCase() === inputB.name.toLowerCase()
}

// Same as above but for merging task and specification
const mergeTaskParams = function(params) {
  return mergeParams(params, mergeTask)
}

const mergeHeaders = function(headers) {
  return mergeResponse(headers, mergeTask)
}

// Deep merge a `task.*.*` value with the specification value
const mergeTask = function(
  { schema: specSchema, ...specValue },
  { schema: taskSchema, ...taskValue },
) {
  const schema = mergeTaskSchema({ specSchema, taskSchema })
  return { ...specValue, ...taskValue, schema }
}

const mergeTaskSchema = function({ specSchema, taskSchema }) {
  if (taskSchema === 'invalid') {
    return mergeInvalidSchema({ specSchema, taskSchema })
  }

  if (!isObject(taskSchema)) {
    return mergeShortcutSchema({ specSchema, taskSchema })
  }

  // Otherwise it is a JSON schema that we deep merge
  return merge({}, specSchema, taskSchema)
}

module.exports = {
  mergeParams,
  mergeResponse,
  mergeTaskParams,
  mergeHeaders,
  mergeTaskSchema,
}
