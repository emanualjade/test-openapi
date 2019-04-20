import { getResultType } from '../../../utils/result_type.js'
import { SEPARATOR } from '../../../utils/line.js'
import { getReportProps } from '../../../props/main.js'
import { assert as serializerAssert } from '../serializer/main.js'

import { getErrorProps } from './error_props.js'

// Add TAP output for each task, as a single assert
export const complete = function(
  task,
  { options: { tap }, silent, ...context },
) {
  const assert = getAssert({ task, context })
  const message = serializerAssert(tap, assert)

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
