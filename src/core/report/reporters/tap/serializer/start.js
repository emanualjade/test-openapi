'use strict'

const { version } = require('./version')
const { plan } = require('./plan')

// Start TAP output
const start = function() {
  const versionString = version()

  const { count } = this
  const planString = plan({ count })

  return `${this.colors.version(versionString)}${this.colors.plan(planString)}`
}

module.exports = {
  start,
}
