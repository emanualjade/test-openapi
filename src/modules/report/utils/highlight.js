'use strict'

const { highlight, highlightAuto } = require('emphasize')
const hasAnsi = require('has-ansi')

const { reset, red, dim, gray, yellow, magenta, italic, bold, inverse } = require('./colors')

// Syntax highlighting, as YAML
const highlightValue = function(string) {
  // Already highlighted
  if (hasAnsi(string)) {
    return string
  }

  const stringA = string.replace(KEY_CHARS_REGEXP, KEY_MARKER)

  const stringB = highlight('yaml', stringA, THEME).value

  const stringC = stringB.replace(KEY_MARKER_REGEXP, KEY_CHARS)
  return stringC
}

// `emphasize` has issues highlighting YAML keys which contain dots
// We temporarily convert them to a special marker to work around the problem
const KEY_CHARS = '.'
const KEY_CHARS_REGEXP = /\./g
const KEY_MARKER = '_'.repeat(10)
const KEY_MARKER_REGEXP = new RegExp(KEY_MARKER, 'g')

// Console (ANSI sequences) syntax color highlighting
// Automatically guesses MIME type/format
const highlightValueAuto = function(string) {
  return highlightAuto(string, THEME).value
}

// Theme colors
const THEME = {
  comment: gray,
  quote: gray,

  symbol: dim,
  bullet: dim,
  subst: dim,
  meta: dim,
  'meta keyword': dim,
  'selector-attr': dim,
  'selector-pseudo': dim,
  link: dim,

  string: reset,

  keyword: magenta,
  'selector-tag': magenta,
  addition: magenta,

  number: magenta,
  'meta meta-string': magenta,
  literal: magenta,
  doctag: magenta,
  regexp: magenta,

  title: magenta,
  section: magenta,
  name: magenta,
  'selector-id': magenta,
  'selector-class': magenta,

  attribute: yellow,
  attr: yellow,
  variable: yellow,
  'template-variable': yellow,
  'class title': yellow,
  type: yellow,

  built_in: red,
  deletion: red,

  emphasis: italic,
  strong: bold,
  formula: inverse,
}

module.exports = {
  highlightValue,
  highlightValueAuto,
}
