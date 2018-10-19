'use strict'

const { omit } = require('lodash')

const { getParams } = require('./params')
const { normalizeResponses } = require('./response')

// Normalize OpenAPI 2.0 operation into specification-agnostic format
const normalizeSpec = function({ spec }) {
  const operations = getOperations({ spec })
  return { operations }
}

const getOperations = function({ spec, spec: { paths } }) {
  const operations = Object.entries(paths).map(([path, pathDef]) =>
    getOperationsByPath({ spec, path, pathDef }),
  )
  const operationsA = [].concat(...operations)
  return operationsA
}

// Iterate over each HTTP method
const getOperationsByPath = function({ spec, path, pathDef }) {
  const pathDefA = omit(pathDef, 'parameters')

  return Object.entries(pathDefA).map(([method, operation]) =>
    getOperation({ spec, path, pathDef, operation, method }),
  )
}

// Normalize cherry-picked properties
const getOperation = function({ spec, path, pathDef, operation, method }) {
  const operationId = getOperationId({ operation })
  const params = getParams({ spec, method, path, pathDef, operation })
  const responsesA = normalizeResponses({ spec, operation })

  return { ...operationId, params, responses: responsesA }
}

const getOperationId = function({ operation: { operationId } }) {
  if (operationId === undefined) {
    return
  }

  return { operationId }
}

module.exports = {
  normalizeSpec,
}
