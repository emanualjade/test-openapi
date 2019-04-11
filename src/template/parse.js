import { searchRegExp } from '../utils/search.js'
import { isObject } from '../utils/types.js'

// Parse:
//  - `$$name` into `{ type: 'value', name: '$$name' }`
//  - `{ $$name: arg }` into `{ type: 'function', name: '$$name', arg }`
//  - `$$name $$nameB` into `{ type: 'concat', tokens }`
export const parseTemplate = function(data) {
  if (typeof data === 'string') {
    return parseTemplateString(data)
  }

  const name = getTemplateName(data)

  if (name === undefined) {
    return
  }

  // `{ $$name: arg }`
  const arg = data[name]
  return { type: 'function', name, arg }
}

const getTemplateName = function(data) {
  // No templating
  if (!isObject(data)) {
    return
  }

  const keys = Object.keys(data)

  // Template functions can be passed arguments by using an object with a
  // single property starting with `$$`
  // This allows objects with several properties not to need escaping
  if (keys.length !== 1) {
    return
  }

  const [name] = keys

  if (!TEMPLATE_REGEXP.test(name)) {
    return
  }

  return name
}

const parseTemplateString = function(data) {
  const tokens = searchRegExp(TEMPLATE_REGEXP_GLOBAL, data)

  // No matches
  if (tokens === undefined) {
    return
  }

  // Single `$$name` without concatenation.
  // As opposed to concatenated string, `$$name` is not transtyped to string.
  if (tokens.length === 1) {
    return { type: 'value', name: data }
  }

  // `$$name` inside another string, i.e. concatenated
  const tokensA = tokens.map(parseToken)
  return { type: 'concat', tokens: tokensA }
}

const parseToken = function(name) {
  const type = TEMPLATE_REGEXP.test(name) ? 'value' : 'raw'
  return { type, name }
}

// Check whether `data` is `$$name` or `{ $$name: arg }`
export const isTemplate = function(data) {
  const template = parseTemplate(data)
  return template !== undefined && !isEscape({ template })
}

// Check if it is `$$name` (but not `$$$name`)
export const isTemplateName = function({ name }) {
  return TEMPLATE_NAME_REGEXP.test(name) && !isEscapeName({ name })
}

// To escape an object that could be taken for a template (but is not), one can
// add an extra `$`, i.e. `{ $$$name: arg }` becomes `{ $$name: arg }`
// and `$$$name` becomes `$$name`
// This works with multiple `$` as well
export const parseEscape = function({
  template,
  template: { type, name, arg },
}) {
  if (!isEscape({ template })) {
    return
  }

  const nameA = name.replace(TEMPLATE_ESCAPE, '')

  if (type === 'function') {
    return { [nameA]: arg }
  }

  return nameA
}

const isEscape = function({ template: { type, name, tokens } }) {
  if (type === 'concat') {
    return tokens.some(template => isEscape({ template }))
  }

  return isEscapeName({ name })
}

const isEscapeName = function({ name }) {
  return name.startsWith(`${TEMPLATE_ESCAPE}${TEMPLATE_PREFIX}`)
}

// Matches `$$name` where `name` can only include `A-Za-z0-9_-` and also
// dot/bracket notations `.[]`
const TEMPLATE_REGEXP = /^\$\$[\w.[\]-]+$/u
const TEMPLATE_REGEXP_GLOBAL = /\$\$[\w.[\]-]+/gu
// Matches `$$name` where `name` can only inclue `A-Za-z0-9_-`
const TEMPLATE_NAME_REGEXP = /^\$\$[\w-]+$/u
// Escape `$$name` with an extra dollar sign, i.e. `$$$name`
const TEMPLATE_PREFIX = '$$'
const TEMPLATE_ESCAPE = '$'
