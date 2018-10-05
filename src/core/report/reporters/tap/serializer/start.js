'use strict'

const { version } = require('./version')
const { plan } = require('./plan')

// Start TAP output
const start = function({ count, colors }) {
  const versionString = version()

  const planString = plan({ count })

  return `${colors.version(versionString)}${colors.plan(planString)}`
}

module.exports = {
  start,
}
