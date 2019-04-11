import chalk from 'chalk'
import stripAnsi from 'strip-ansi'
import { mapValues } from 'lodash'

import { isObject } from '../../../utils/types.js'

// Colors used in reporting
const { yellow, inverse } = chalk
// Nested keys
export { yellow }
// Modifiers
export { inverse }

// Main colors, e.g. for fail, pass and skip|comment
// eslint-disable-next-line no-magic-numbers
export const red = chalk.rgb(200, 0, 0)
// eslint-disable-next-line no-magic-numbers
export const green = chalk.rgb(0, 150, 0)
// eslint-disable-next-line no-magic-numbers
export const gray = chalk.rgb(100, 100, 100)

// Top-level keys
// eslint-disable-next-line no-magic-numbers
export const orange = chalk.rgb(250, 100, 50)

// Utility function
export const removeColors = function(value) {
  if (isObject(value)) {
    return mapValues(value, removeColors)
  }

  return stripAnsi(value)
}
