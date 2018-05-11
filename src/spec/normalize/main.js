'use strict'

const { loadOpenApiSpec } = require('../load')
const { getOperations } = require('./operations')

// Parses an OpenAPI file (including JSON references)
// Then validates its syntax
// Then normalize it
const loadNormalizedSpec = async function({ path }) {
  const spec = await loadOpenApiSpec({ path })

  const specA = normalizeSpec({ spec })
  return specA
}

// Normalize specification object
// We do not use Sway for traversing as it has some problems, e.g. does not
// properly parse security alternatives
// Also it eases being specification-agnostic
const normalizeSpec = function({ spec }) {
  const url = getUrl({ spec })
  const operations = getOperations({ spec })

  const specA = { url, operations }
  return specA
}

// TODO: support `spec.schemes` instead of always using HTTP
const getUrl = function({ spec: { host: hostname, basePath } }) {
  return `http://${hostname}${basePath}`
}

module.exports = {
  loadNormalizedSpec,
}
