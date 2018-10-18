'use strict'

const { uniqBy } = require('lodash')

const { TestOpenApiError } = require('../../../../../errors')
const { locationToKey } = require('../../../../../utils')

const IN_TO_LOCATION = require('./in_to_location')

// Normalize OpenAPI security request parameters into specification-agnostic
// format
const getSecParams = function({
  spec: {
    securityDefinitions,
    security: apiSecurity = [],
    components: {
      securitySchemes: secSchemes
    }
  },
  operation: { security = apiSecurity },
}) {
  const secRefs = getSecRefs({ security })
  const secDef = getSecDefs({ securityDefinitions, securitySchemes: secSchemes})
  const secParams = secRefs.map(([secName, scopes]) =>
    getSecParam({ secName, scopes, securityDefinitions: secDef }),
  )
  const secParamsA = Object.assign({}, ...secParams)
  return secParamsA
}

const getSecDefs = function({ securityDefinitions, securitySchemes }) {
  // Check if either 2.0 or 3.0 exist
  if ((securityDefinitions === undefined) && (securitySchemes === undefined)) {
    throw new TestOpenApiError(
      `Could not find OpenAPI 2 'securityDefinitions' or OpenAPI 3 'components.securitySchemes' from the spec root`
    )
  }

  // Check for 2.0
  if (securityDefinitions === undefined) {
    return securitySchemes
  }

  return securityDefinitions
}

const getSecRefs = function({ security }) {
  const securityA = security.map(Object.entries)
  const securityB = [].concat(...securityA)
  const securityC = uniqBy(securityB, JSON.stringify)
  return securityC
}

// Retrieve among the `securityDefinitions`
const getSecParam = function({ secName, scopes, securityDefinitions }) {
  const securityDef = securityDefinitions[secName]
  const securityDefA = normalizeSecurityDef({ securityDef, secName, scopes })
  return securityDefA
}

// Normalize security to the same format as other parameters
const normalizeSecurityDef = function({ securityDef, secName, scopes }) {
  const handler = getSecParamHandler({ securityDef, secName })
  const secParam = handler({ ...securityDef, scopes })
  return secParam
}

const getSecParamHandler = function({ securityDef: { type }, secName }) {
  const handler = SECURITY_DEFS[type]

  if (handler !== undefined) {
    return handler
  }

  throw new TestOpenApiError(
    `In 'securityDefinitions.${secName}', security definition has type '${type}' but this has not been implemented yet`,
  )
}

// `apiKey` security definitions -> `headers|query` request parameter
const getDefApiKey = function({ name, in: paramIn }) {
  const location = IN_TO_LOCATION[paramIn]
  const key = locationToKey({ name, location })

  return { [key]: { type: 'string', optional: true } }
}

const getDefHttpKey = function({ scheme }) {
  const scheme_type = HTTP_SCHEME_TYPES[scheme]

  if (scheme_type === undefined) {
    throw new TestOpenApiError(
      `Other HTTP schemes defined by RFC 7235 not yet supported`,
    )
  }

  const location = IN_TO_LOCATION['header']
  const key = locationToKey({ name: 'authorization', location})

  return { [key]: { type: 'string', optional: false } }
}

const SECURITY_DEFS = {
  apiKey: getDefApiKey,
  http: getDefHttpKey
}

const HTTP_SCHEME_TYPES = Object.freeze({
  "basic": 1,
  "bearer": 2
})

module.exports = {
  getSecParams,
}
