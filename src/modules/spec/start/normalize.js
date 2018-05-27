'use strict'

const { loadOpenApiSpec } = require('./load')
const { getOperations } = require('./operations')

// Parse, validate and normalize an OpenAPI specification (including JSON references)
const loadNormalizedSpec = async function({ spec }) {
  if (spec === undefined) {
    return
  }

  const specA = await loadOpenApiSpec({ spec })

  const specB = normalizeSpec({ spec: specA })

  return { spec: specB }
}

// Normalize specification object
const normalizeSpec = function({ spec }) {
  const operations = getOperations({ spec })
  return { operations }
}

module.exports = {
  loadNormalizedSpec,
}
