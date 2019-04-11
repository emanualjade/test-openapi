import { indent } from '../../../utils/indent.js'
import { stopSpinner } from '../../../utils/spinner.js'
import { LINE } from '../constants.js'

import { printTasksList } from './list.js'
import { printSummary } from './summary.js'

// Clears spinner and print summarized tasks list and final counters message
export const end = function(tasks, { options, options: { spinner } }) {
  stopSpinner(spinner)

  const endMessage = getEndMessage({ tasks, options })
  return endMessage
}

const getEndMessage = function({ tasks, options }) {
  const tasksList = printTasksList({ tasks, options })
  const summaryString = printSummary({ tasks })

  return `${LINE}
${tasksList}${indent(summaryString)}
${LINE}
`
}
