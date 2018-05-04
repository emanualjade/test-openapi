'use strict'

// Get list of authentication-related headers or query variables
const getSecurityParams = function({ operationObject }) {
  const securities = getOperationSecurities({ operationObject })
  const securityDefs = getSecurityDefs({ securities, operationObject })
  return securityDefs
}

// We do not use Sway's `operationObject.securityDefinitions` because it does not
// take into account that securities can be alternatives (i.e. an array of objects).
const getOperationSecurities = function({
  operationObject: {
    security: operationSecurity,
    pathObject: {
      api: { security: apiSecurity = [] },
    },
  },
}) {
  if (operationSecurity !== undefined) {
    return operationSecurity
  }

  return apiSecurity
}

const getSecurityDefs = function({
  securities,
  operationObject: {
    pathObject: {
      api: { securityDefinitions },
    },
  },
}) {
  return securities.map(security => getSecurityDef({ security, securityDefinitions }))
}

const getSecurityDef = function({ security, securityDefinitions }) {
  return Object.entries(security).map(([name, scopes]) =>
    getDef({ securityDefinitions, name, scopes }),
  )
}

const getDef = function({ securityDefinitions, name, scopes }) {
  const def = securityDefinitions[name]
  const handler = getDefHandler(def)
  const defA = handler({ ...def, scopes })
  const defB = { secName: name, ...defA }
  return defB
}

const getDefHandler = function({ type }) {
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
  getSecurityParams,
}
