'use strict'

const { isShortcut } = require('../../../utils')

// Get `task.errorProps`, i.e. plugin-specific error properties printed on reporting
const getErrorProps = function({ plugins }) {
  const errorPropsA = plugins.map(({ report: { errorProps = [] } = {} }) => errorProps)
  const errorPropsB = CORE_ERROR_PROPS.concat(...errorPropsA)
  return errorPropsB
}

const CORE_ERROR_PROPS = [
  { name: 'Expected value', value: 'expected' },
  { name: 'Actual value', value: 'actual' },
  { name: 'Property', value: 'property' },
  { name: 'JSON schema', value: 'schema', exclude: isShortcut, highlighted: true },
]

module.exports = {
  getErrorProps,
}
