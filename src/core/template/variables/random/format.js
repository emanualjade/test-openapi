'use strict'

const jsonSchemaFaker = require('json-schema-faker')
// eslint-disable-next-line import/no-internal-modules
const formatRegExps = require('ajv/lib/compile/formats')

// Allow `json-schema-faker` to use all the `format` that `ajv` can handle,
// except `regexp`. Note that AJV does not support JSON schema v7 formats
// `idn-email|hostname` nor `iri[-reference]`
const addCustomFormats = function() {
  Object.entries(CUSTOM_FORMATS).forEach(addCustomFormat)
}

const addCustomFormat = function([name, regexp]) {
  jsonSchemaFaker.format(name, () => jsonSchemaFaker.random.randexp(regexp))
}

// UUID any version
const UUID_REGEXP = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/u

const CUSTOM_FORMATS = {
  // JSON schema v6
  'uri-template': formatRegExps.full['uri-template'],
  'json-pointer': formatRegExps.full['json-pointer'],

  // JSON schema v7
  date: formatRegExps.fast.date,
  time: formatRegExps.fast.time,
  'relative-json-pointer': formatRegExps.full['relative-json-pointer'],

  // Custom AJV format
  url: formatRegExps.full.url,
  'json-pointer-uri-fragment': formatRegExps.full['json-pointer-uri-fragment'],
  uuid: UUID_REGEXP,
}

module.exports = {
  addCustomFormats,
}
