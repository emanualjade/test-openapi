'use strict'

const { isObject, promiseThen, promiseAll, promiseAllThen } = require('../utils')

// We use `promise[All][Then]()` utilities to avoid creating microtasks when
// no helpers is found or when helpers are synchronous.
const crawlNode = function(value, path, info, evalNode) {
  // Children must be evaluated before parents
  const valueA = crawlChildren(value, path, info, evalNode)
  return promiseThen(valueA, valueB => evalNode(valueB, path, info))
}

// Siblings evaluation is done in parallel for best performance.
const crawlChildren = function(value, path, info, evalNode) {
  if (Array.isArray(value)) {
    const children = value.map((child, index) => crawlNode(child, [...path, index], info, evalNode))
    return promiseAll(children)
  }

  if (isObject(value)) {
    const children = Object.entries(value).map(([key, child]) =>
      crawlProperty({ key, child, path, info, evalNode }),
    )
    return promiseAllThen(children, mergeProperties)
  }

  return value
}

const crawlProperty = function({ key, child, path, info, evalNode }) {
  const maybePromise = crawlNode(child, [...path, key], info, evalNode)
  return promiseThen(maybePromise, childA => getProperty({ key, child: childA }))
}

const getProperty = function({ key, child }) {
  // Helpers that do not exist or that return `undefined` are omitted
  // (as opposed to being set to `undefined`) to keep task JSON-serializable
  // and avoid properties that are defined but set to `undefined`
  if (child === undefined) {
    return
  }

  return { [key]: child }
}

const mergeProperties = function(children) {
  return Object.assign({}, ...children)
}

module.exports = {
  crawlNode,
}
