import jsonSchemaFaker from 'json-schema-faker'
import { fast, full } from 'ajv/lib/compile/formats.js'

const { date: dateRegExp, time: timeRegExp } = fast
const {
  url: urlRegExp,
  'uri-template': uriTemplateRegExp,
  'json-pointer': jsonPointerRegExp,
  'relative-json-pointer': relJsonPointerRegExp,
  'json-pointer-uri-fragment': jsonPointerFragRegExp,
} = full

// Allow `json-schema-faker` to use all the `format` that `ajv` can handle,
// except `regexp`. Note that AJV does not support JSON schema v7 formats
// `idn-email|hostname` nor `iri[-reference]`
export const addCustomFormats = function() {
  Object.entries(CUSTOM_FORMATS).forEach(addCustomFormat)
}

const addCustomFormat = function([name, regexp]) {
  jsonSchemaFaker.format(name, () => jsonSchemaFaker.random.randexp(regexp))
}

// UUID any version
const UUID_REGEXP = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/u

const CUSTOM_FORMATS = {
  // JSON schema v6
  'uri-template': uriTemplateRegExp,
  'json-pointer': jsonPointerRegExp,

  // JSON schema v7
  date: dateRegExp,
  time: timeRegExp,
  'relative-json-pointer': relJsonPointerRegExp,

  // Custom AJV format
  url: urlRegExp,
  'json-pointer-uri-fragment': jsonPointerFragRegExp,
  uuid: UUID_REGEXP,
}
