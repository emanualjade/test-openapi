'use strict'

const { highlight, highlightAuto } = require('emphasize')

const { reset, red, dim, grey, yellow, magenta, italic, bold, inverse } = require('./colors')

// Syntax highlighting
const highlightValue = function({ string, value, format }) {
  // Not performed on strings, unless `format` was specified
  if (typeof value === 'string' && format === undefined) {
    return string
  }

  // Non-strings are highlighted as YAML, unless `errorProp.format` was explicited
  const formatA = format || 'yaml'

  return highlight(formatA, string, THEME).value
}

// Console (ANSI sequences) syntax color highlighting
// Automatically guesses MIME type/format
const highlightValueAuto = function(string) {
  return highlightAuto(string, THEME).value
}

// Theme colors
const THEME = {
  comment: grey,
  quote: grey,

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
