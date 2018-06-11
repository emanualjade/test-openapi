'use strict'

const { omit } = require('lodash')

const { getParams } = require('./params')
const { normalizeResponses } = require('./response')

// Normalize OpenAPI operation into specification-agnostic format
const normalizeSpec = function({ spec, server }) {
  const operations = getOperations({ spec, server })
  return { operations }
}

const getOperations = function({ spec, spec: { paths }, server }) {
  const operations = Object.entries(paths).map(([path, pathDef]) =>
    getOperationsByPath({ spec, path, pathDef, server }),
  )
  const operationsA = [].concat(...operations)
  return operationsA
}

// Iterate over each HTTP method
const getOperationsByPath = function({ spec, path, pathDef, server }) {
  const pathDefA = omit(pathDef, 'parameters')

  return Object.entries(pathDefA).map(([method, operation]) =>
    getOperation({ spec, path, pathDef, operation, method, server }),
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
  server,
}) {
  const params = getParams({ spec, method, path, pathDef, operation, server })
  const responsesA = normalizeResponses({ responses, spec, operation })

  return { operationId, params, responses: responsesA }
}

module.exports = {
  normalizeSpec,
}
