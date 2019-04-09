import { version } from './version.js'
import { plan } from './plan.js'

// Start TAP output
export const start = function({ count, colors }) {
  const versionString = version()

  const planString = plan({ count })

  return `${colors.version(versionString)}${colors.plan(planString)}`
}
