import { STATUS_REGEXP } from './status/parse.js'

// Make `validate.[STATUS.]headers.*` case-insensitive
// Also remove `undefined` validate values
export const normalizeValidate = function({ validate }) {
  return normalizeObject(validate)
}

const normalizeObject = function(object) {
  const validateA = Object.entries(object)
    .filter(isDefined)
    .map(normalizeKeys)
  const validateB = Object.assign({}, ...validateA)
  return validateB
}

const isDefined = function([, value]) {
  return value !== undefined
}

const normalizeKeys = function([name, value]) {
  // Recurse over `validate.STATUS.*`
  if (STATUS_REGEXP.test(name)) {
    return { [name]: normalizeObject(value) }
  }

  if (!name.startsWith('headers.')) {
    return { [name]: value }
  }

  return { [name.toLowerCase()]: value }
}
