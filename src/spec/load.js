'use strict'

const { dirname, basename } = require('path')

const { addErrorHandler, throwSpecificationError } = require('../errors')

const { validateOpenApi } = require('./validate')

// Parses an OpenAPI file (including JSON references)
// Then validates its syntax
const loadOpenApiSpec = async function({ path }) {
  const spec = await eLoadSpec({ path })

  validateOpenApi({ spec })

  return spec.definitionFullyResolved
}

const loadSpec = async function({ path }) {
  const definition = basename(path)
  const relativeBase = dirname(path)

  const sway = getSway()
  const specA = await sway.create({ definition, jsonRefs: { relativeBase } })
  return specA
}

const loadSpecHandler = function({ message }) {
  throwSpecificationError(`OpenAPI specification could not be loaded: ${message}`)
}

const eLoadSpec = addErrorHandler(loadSpec, loadSpecHandler)

// This is needed until https://github.com/whitlockjc/json-refs/pull/133
// is merged.
// Sway's dependency `json-refs` caches files, so when this function gets called
// again, it might received old file contents.
// This is problematic for Gulp tasks running in watch mode.
const getSway = function() {
  Object.keys(require.cache)
    .filter(path => path.includes('/sway/') || path.includes('/json-refs/'))
    .forEach(path => delete require.cache[path])
  const sway = require('sway')
  return sway
}

module.exports = {
  loadOpenApiSpec,
}
