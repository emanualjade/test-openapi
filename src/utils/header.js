'use strict'

// Turn `content-type` into `Content-Type`
const capitalizeHeader = function({ name }) {
  return name.replace(CAPITALIZE_HEADER_REGEXP, char => char.toUpperCase())
}

const CAPITALIZE_HEADER_REGEXP = /(^|-)./g

module.exports = {
  capitalizeHeader,
}
