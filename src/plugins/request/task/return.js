'use strict'

const { locationToKey } = require('../../../utils')

// Normalize returned `request` value
const getReturnValue = function({ params }) {
  const request = normalizeRequest({ params })
  return { request }
}

const normalizeRequest = function({ params }) {
  const paramsA = params.map(normalizeParam)
  const request = Object.assign({}, ...paramsA)
  return request
}

const normalizeParam = function({ location, name, value }) {
  const key = locationToKey({ location, name })
  return { [key]: value }
}

module.exports = {
  getReturnValue,
}
