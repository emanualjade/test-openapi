'use strict'

// Normalize OpenAPI security request parameters into specification-agnostic format
const getSecurity = function({
  spec: { securityDefinitions, security: apiSecurity = [] },
  operation: { security = apiSecurity },
}) {
  return security.map(securityAlternative =>
    getSecurityAlternative({ securityAlternative, securityDefinitions }),
  )
}

// OpenAPI allow each operation to specify a list of security alternatives
// Each security alternative is itself a list of security parameters
const getSecurityAlternative = function({ securityAlternative, securityDefinitions }) {
  return Object.entries(securityAlternative).map(([secName, scopes]) =>
    getSecurityDef({ secName, scopes, securityDefinitions }),
  )
}

// Retrieve among the `securityDefinitions`
const getSecurityDef = function({ secName, scopes, securityDefinitions }) {
  const securityDef = securityDefinitions[secName]
  const securityDefA = normalizeSecurityDef({ securityDef })
  return { ...securityDefA, secName, scopes }
}

// Normalize security to the same format as other parameters
const normalizeSecurityDef = function({ securityDef }) {
  const handler = getSecParamHandler(securityDef)
  const secParam = handler(securityDef)
  return secParam
}

const getSecParamHandler = function({ type }) {
  const handler = SECURITY_DEFS[type]
  if (handler !== undefined) {
    return handler
  }

  throw new Error(`Security definitions of type '${type}' are not implemented yet`)
}

// `apiKey` security definitions -> `header|query` request paramater
const getDefApiKey = function({ name, in: location }) {
  return { name, location, required: true, schema: { type: 'string' } }
}

const SECURITY_DEFS = {
  apiKey: getDefApiKey,
}

module.exports = {
  getSecurity,
}
