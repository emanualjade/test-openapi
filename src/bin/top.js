import yargs from 'yargs'

export const defineCli = function() {
  return yargs
    .options(CONFIG)
    .usage(USAGE)
    .example(RUN_EXAMPLE, 'Run tasks')
    .help()
    .version()
    .strict()
}

const CONFIG = {
  plugins: {
    array: true,
    string: true,
    alias: 'p',
    requiresArg: true,
    describe: 'Plugin to extend the core features',
  },
  report: {
    describe: 'Reporting options',
  },
  'report.output': {
    string: true,
    alias: 'o',
    requiresArg: true,
    describe: 'File output (default: stdout)',
  },
  'report.level': {
    string: true,
    alias: 'l',
    requiresArg: true,
    describe:
      'Verbosity among "debug", "info" (default for most reporting styles), "warn" (default for "pretty" reporting styles), "error" or "silent"',
  },
  only: {
    array: true,
    string: true,
    alias: 'f',
    requiresArg: true,
    describe: 'Only run tasks whose key matches the regular expression',
  },
  skip: {
    array: true,
    string: true,
    alias: 'x',
    requiresArg: true,
    describe: 'Skip tasks whose key matches the regular expression',
  },
  merge: {
    describe: 'Shared options assigned to each task',
  },
}

const USAGE = `$0 [OPTS] [TASKS_FILES...]

Automated client requests

TASKS_FILES... are JSON or YAML files containing the tasks to perform.
Can include globbing patterns.
Defaults to any file ending with 'tasks.yml.json'`

const RUN_EXAMPLE =
  '$0 --merge.spec.definition ./openapi.yml --merge.call.server http://localhost:5001 ./**/*.tasks.yml'
