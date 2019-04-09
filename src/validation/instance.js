import Ajv from 'ajv'

// Retrieve `ajv` instance
const getInstance = function() {
  return new Ajv(AJV_OPTS)
}

// Make logging silent (e.g. warn on unknown format) but throws on errors
const logger = {
  // eslint-disable-next-line no-empty-function
  log() {},
  // eslint-disable-next-line no-empty-function
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
  strictDefaults: true,
  strictKeywords: true,
}

// Called only once
export const defaultInstance = getInstance()
