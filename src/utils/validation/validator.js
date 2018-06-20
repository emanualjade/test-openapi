'use strict'

const Ajv = require('ajv')
const AjvKeywords = require('ajv-keywords')

// Retrieve `ajv` instance
const getValidator = function() {
  const ajv = new Ajv(AJV_OPTS)

  AjvKeywords(ajv, CUSTOM_KEYWORDS)

  return ajv
}

const CUSTOM_KEYWORDS = ['typeof']

// Make logging silent (e.g. warn on unknown format) but throws on errors
const logger = {
  log() {},
  warn() {},
  error(message) {
    throw message
  },
}

const AJV_OPTS = {
  // AJV error messages can look overwhelming, so let's keep only the first one
  allErrors: false,
  format: 'full',
  // JSON schema allows unknown formats
  unknownFormats: 'ignore',
  logger,
}

// Called only once
const validator = getValidator()

module.exports = {
  validator,
  CUSTOM_KEYWORDS,
}
