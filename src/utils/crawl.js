'use strict'

const { flattenDeep } = require('lodash')

// Crawl a value to an array of all its properties and deep properties where
// each item is:
//  - `value`: property value
//  - `path`: path to the property, as an array of strings|integers
const crawl = function(value) {
  const nodes = crawlNode(value, [])
  const nodesA = flattenDeep(nodes)
  return nodesA
}

const crawlNode = function(value, path) {
  const node = { value, path }
  const children = crawlChildren(value, path)
  return [node, ...children]
}

const crawlChildren = function(value, path) {
  if (value === null || typeof value !== 'object') {
    return []
  }

  if (Array.isArray(value)) {
    return value.map((child, index) => crawlNode(child, [...path, index]))
  }

  return Object.entries(value).map(([key, child]) => crawlNode(child, [...path, key]))
}

module.exports = {
  crawl,
}
