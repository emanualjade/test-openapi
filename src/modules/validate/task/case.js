'use strict'

const { mapKeys, mapValues } = require('lodash')

// Make `validate` case-insensitive
const normalizeCase = function({ validate: { byStatus = {}, ...validate } }) {
  const validateA = normalizeObject(validate)
  const byStatusA = mapValues(byStatus, normalizeObject)
  return { ...validateA, byStatus: byStatusA }
}

const normalizeObject = function(object) {
  return mapKeys(object, normalizeKey)
}

const normalizeKey = function(value, name) {
  return name.toLowerCase()
}

module.exports = {
  normalizeCase,
}
