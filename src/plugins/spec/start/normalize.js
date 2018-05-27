'use strict'

const { loadOpenApiSpec } = require('./load')
const { getOperations } = require('./operations')

// Parses an OpenAPI file (including JSON references)
// Then validates its syntax
// Then normalize it
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
