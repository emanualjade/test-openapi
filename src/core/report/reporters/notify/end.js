import notifier from 'node-notifier'

import { getSummary } from '../../utils/summary.js'
import { isSilentType } from '../../level/silent.js'

// Show notification at end of run
export const end = function(tasks, { options }) {
  const opts = getOpts({ tasks, options })

  if (opts === undefined) {
    return
  }

  notifier.notify(opts)
}

const getOpts = function({ tasks, options }) {
  const { ok, total, pass, fail, skip } = getSummary({ tasks })

  const { resultType, ...opts } = OPTS[ok]

  if (isSilentType({ resultType, options })) {
    return
  }

  const message = opts.message({ total, pass, fail })

  const messageA = addSkipMessage({ message, skip, options })

  return { ...opts, message: messageA }
}

const getPassMessage = function({ total, pass }) {
  return `${pass} of ${total} tasks passed.`
}

const getFailMessage = function({ total, fail }) {
  return `${fail} of ${total} tasks failed.`
}

const addSkipMessage = function({ message, skip, options }) {
  if (skip === 0 || isSilentType({ resultType: 'skip', options })) {
    return message
  }

  return `${message}\n${skip} tasks were skipped.`
}

const PASS_OPTS = {
  title: 'Tasks passed.',
  message: getPassMessage,
  icon: `${__dirname}/passed.png`,
  sound: false,
  resultType: 'pass',
}

const FAIL_OPTS = {
  title: 'Tasks failed!',
  message: getFailMessage,
  icon: `${__dirname}/failed.png`,
  sound: 'Basso',
  resultType: 'fail',
}

const OPTS = {
  true: PASS_OPTS,
  false: FAIL_OPTS,
}
