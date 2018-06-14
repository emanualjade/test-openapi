'use strict'

// Get `task.title`, i.e. full name taken from all `plugin.report.title`
const getTitle = function({ task, plugins }) {
  return plugins
    .map(plugin => getPluginTitle({ task, plugin }))
    .filter(isDefinedTitle)
    .join(' ')
}

// Call `plugin.report.title(task[pluginName])`
const getPluginTitle = function({ task, plugin: { report: { title } = {} } }) {
  if (title === undefined) {
    return
  }

  return title(task)
}

const isDefinedTitle = function(title) {
  return title !== undefined && title.trim() !== ''
}

module.exports = {
  getTitle,
}
