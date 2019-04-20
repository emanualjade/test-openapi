import { omit } from 'lodash'

import { locationToKey } from '../../../../../utils/location.js'
import { normalizeSchema } from '../json_schema.js'

import { IN_TO_LOCATION } from './in_to_location.js'
import { addSeparator } from './separator.js'

// From OpenAPI request `parameters` to normalized format
export const normalizeParams = function({ params }) {
  const paramsA = params.map(normalizeParam)
  const paramsB = Object.assign({}, ...paramsA)
  return paramsB
}

const normalizeParam = function({
  name,
  in: paramIn,
  required = false,
  collectionFormat,
  ...schema
}) {
  const key = getParamKey({ name, paramIn })
  const schemaA = getParamSchema({ schema, required, collectionFormat })
  return { [key]: schemaA }
}

const getParamKey = function({ name, paramIn }) {
  const location = IN_TO_LOCATION[paramIn]
  const key = locationToKey({ name, location })
  return key
}

const getParamSchema = function({ schema, required, collectionFormat }) {
  const schemaA = getSchema({ schema })

  const schemaB = { ...schemaA, optional: !required }

  const schemaC = addSeparator({ schema: schemaB, collectionFormat })
  return schemaC
}

// Normalize OpenAPI `in` to the same keys as `task.params.*`
const getSchema = function({ schema }) {
  // `allowEmptyValue` is deprecated and is ambiguous
  // (https://github.com/OAI/OpenAPI-Specification/issues/1573)
  // so we skip it
  const schemaA = omit(schema, 'allowEmptyValue')
  // OpenAPI schema can be either a `schema` property, or is directly merged in
  const schemaB = schemaA.schema || schemaA
  const schemaC = normalizeSchema({ schema: schemaB })
  return schemaC
}
