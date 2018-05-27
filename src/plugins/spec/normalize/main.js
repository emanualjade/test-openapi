'use strict'

const { loadOpenApiSpec } = require('../load')

const { getOperations } = require('./operations')

// Parses an OpenAPI file (including JSON references)
// Then validates its syntax
// Then normalize it
const loadNormalizedSpec = async function({ spec: path }) {
  if (path === undefined) {
    return
  }

  const spec = await loadOpenApiSpec({ path })

  const specA = normalizeSpec({ spec })

  return { spec: specA }
}

// Normalize specification object
// We do not use Sway for traversing as it has some problems, e.g. does not
// properly parse security alternatives
// Also it eases being specification-agnostic
const normalizeSpec = function({ spec }) {
  const operations = getOperations({ spec })
  return { operations }
}

module.exports = {
  loadNormalizedSpec,
}
