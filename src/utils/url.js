'use strict'

const { URL } = require('url')

// Normalize anv validate URL
const normalizeUrl = function({ url }) {
  const urlA = new URL(url)
  const urlB = urlA.toString()
  return urlB
}

module.exports = {
  normalizeUrl,
}
