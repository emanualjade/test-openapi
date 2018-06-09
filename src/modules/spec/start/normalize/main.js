'use strict'

const { flatten, omit } = require('lodash')

const { getParams } = require('./params')
const { normalizeResponses } = require('./response')

// Normalize OpenAPI operation into specification-agnostic format
const normalizeSpec = function({ spec }) {
  const operations = getOperations({ spec })
  return { operations }
}

const getOperations = function({ spec, spec: { paths } }) {
  const operations = Object.entries(paths).map(([path, pathDef]) =>
    getOperationsByPath({ spec, path, pathDef }),
  )
  const operationsA = flatten(operations)
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
const getOperation = function({
  spec,
  path,
  pathDef,
  operation,
  operation: { responses, operationId },
  method,
}) {
  const params = getParams({ spec, method, path, pathDef, operation })
  const responsesA = normalizeResponses({ responses, spec, operation })

  return { operationId, params, responses: responsesA }
}

module.exports = {
  normalizeSpec,
}
