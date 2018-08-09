'use strict'

const { promiseThen, promiseAll, promiseAllThen } = require('./promise')

// Crawl and replace an object.
// We use `promise[All][Then]()` utilities to avoid creating microtasks when
// `evalNode|evalKey` is synchronous.
const crawl = function(value, evalNode, { evalKey, info, topDown = false } = {}) {
  return crawlNode(value, [], { evalNode, evalKey, info, topDown })
}

const crawlNode = function(value, path, opts) {
  if (opts.topDown) {
    const valueA = evalNodeValue({ value, path, opts })
    return promiseThen(valueA, valueB => crawlChildren(valueB, path, opts))
  }

  const valueA = crawlChildren(value, path, opts)
  return promiseThen(valueA, valueB => evalNodeValue({ value: valueB, path, opts }))
}

// Siblings evaluation is done in parallel for best performance.
const crawlChildren = function(value, path, opts) {
  if (Array.isArray(value)) {
    const children = value.map((child, index) => crawlNode(child, [...path, index], opts))
    return promiseAll(children)
  }

  if (typeof value === 'object' && value !== null) {
    const children = Object.entries(value).map(([key, child]) =>
      crawlProperty({ key, child, path, opts }),
    )
    return promiseAllThen(children, mergeProperties)
  }

  return value
}

const crawlProperty = function({ key, child, path, opts }) {
  const keyMaybePromise = evalNodeKey({ key, path, opts })
  const valueMaybePromise = crawlNode(child, [...path, key], opts)
  const promises = [keyMaybePromise, valueMaybePromise]
  return promiseAllThen(promises, ([key, value]) => getProperty({ key, value }))
}

const getProperty = function({ key, value }) {
  if (key === undefined) {
    return
  }

  return { [String(key)]: value }
}

const mergeProperties = function(children) {
  return Object.assign({}, ...children)
}

// Allow modifying any type values with `evalNode`
const evalNodeValue = function({ value, path, opts: { evalNode, info } }) {
  if (evalNode === undefined) {
    return value
  }

  return evalNode(value, path, info)
}

// Allow modifying property keys with `opts.evalKey`
const evalNodeKey = function({ key, path, opts: { evalKey, info } }) {
  if (evalKey === undefined) {
    return key
  }

  return evalKey(key, path, info)
}

module.exports = {
  crawl,
}
