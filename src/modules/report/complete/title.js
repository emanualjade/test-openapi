'use strict'

// Add `task.title`, i.e. full name taken from all `plugin.report.title`
const addTitle = function({ input, input: { task }, plugins }) {
  const title = getTitle({ task, plugins })
  return { ...input, task: { ...task, title } }
}

const getTitle = function({ task, plugins }) {
  return plugins
    .map(plugin => getPluginTitle({ task, plugin }))
    .filter(isDefinedTitle)
    .join(' ')
}

// Call `plugin.report.title(task[pluginName])`
const getPluginTitle = function({ task, plugin: { name, report: { title } = {} } }) {
  if (title === undefined) {
    return
  }

  const pluginOpts = task[name] || {}
  return title(pluginOpts)
}

const isDefinedTitle = function(title) {
  return title !== undefined && title.trim() !== ''
}

module.exports = {
  addTitle,
}
