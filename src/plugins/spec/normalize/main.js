'use strict'

const { loadOpenApiSpec } = require('../load')

const { getOperations } = require('./operations')

// Parses an OpenAPI file (including JSON references)
// Then validates its syntax
// Then normalize it
const loadNormalizedSpec = async function({ spec: path, server }) {
  const spec = await loadOpenApiSpec({ path })

  const specA = normalizeSpec({ spec, server })

  return { spec: specA }
}

// Normalize specification object
// We do not use Sway for traversing as it has some problems, e.g. does not
// properly parse security alternatives
// Also it eases being specification-agnostic
const normalizeSpec = function({ spec, server }) {
  const operations = getOperations({ spec, server })
  return { operations }
}

module.exports = {
  loadNormalizedSpec,
}
