import { getResultType, SEPARATOR } from '../../../utils.js'
import { getReportProps } from '../../../props.js'
// eslint-disable-next-line import/no-namespace
import * as serializer from '../serializer.js'

import { getErrorProps } from './error_props.js'

// Add TAP output for each task, as a single assert
export const complete = function(task, { options: { tap }, silent, ...context }) {
  const assert = getAssert({ task, context })
  const message = serializer.assert(tap, assert)

  if (silent) {
    return ''
  }

  return message
}

const getAssert = function({ task, task: { key }, context }) {
  const { titles, reportProps } = getReportProps({ task, context })

  const resultType = getResultType(task)

  const ok = resultType !== 'fail'
  const name = getName({ key, titles })
  const directive = { skip: resultType === 'skip' }
  const errorProps = getErrorProps({ ok, reportProps })

  return { ok, name, directive, error: errorProps }
}

const getName = function({ key, titles }) {
  return [key, ...titles]
    .map(string => string.trim())
    .filter(string => string !== '')
    .join(SEPARATOR)
}
