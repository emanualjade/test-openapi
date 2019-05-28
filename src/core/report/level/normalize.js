// Normalize `config.report.REPORTER.level`
// The reporting level should affect individual tasks reporting, not the summary
// `types` decides whether to show errors, successes, skipped tasks
// `taskData` decided whether to include task.PLUGIN.*
//    - `added` means only the added props (i.e. not in `task.config.task.*`)
export const normalizeLevel = function({ options, reporter }) {
  const levelA = options.level || reporter.level || DEFAULT_LEVEL
  const levelB = LEVELS[levelA]
  return levelB
}

const DEFAULT_LEVEL = 'info'

const LEVELS = {
  silent: {
    types: [],
    taskData: 'none',
  },
  error: {
    types: ['fail'],
    taskData: 'none',
  },
  warn: {
    types: ['fail'],
    taskData: 'added',
  },
  info: {
    types: ['fail', 'pass', 'skip'],
    taskData: 'added',
  },
  debug: {
    types: ['fail', 'pass', 'skip'],
    taskData: 'all',
  },
}
