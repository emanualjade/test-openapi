import { getPath } from '../../../utils/path.js'
import { removePrefixes } from '../../../utils/prefix.js'
import { checkSchema } from '../../../validation/check.js'

import { checkRequired } from './required.js'

// Validates response headers
export const validateHeaders = function({ validate, response }) {
  const validatedHeaders = removePrefixes(validate, 'headers')
  const headers = removePrefixes(response, 'headers')

  Object.entries(validatedHeaders).forEach(([name, schema]) =>
    validateHeader({ name, schema, headers }),
  )
}

const validateHeader = function({ name, schema, headers }) {
  const header = getResponseHeader({ headers, name })

  checkRequired({
    schema,
    value: header,
    property: PROPERTY(name),
    name: NAME(name),
  })

  if (header === undefined) {
    return
  }

  // Validates response header against JSON schema from specification
  checkSchema({
    schema,
    value: header,
    schemaProp: PROPERTY(name),
    message: `${NAME(name)} is invalid`,
  })
}

const getResponseHeader = function({ headers, name }) {
  const nameB = Object.keys(headers).find(nameA => nameA === name)

  if (nameB === undefined) {
    return
  }

  return headers[nameB]
}

const PROPERTY = name => getPath(['task', 'validate', `headers.${name}`])
const NAME = name => `response header '${name}'`
