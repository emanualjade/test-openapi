'use strict'

const { red, dim } = require('../../../utils')

// Retrieve top of error printed message
const getHeader = function({ task, error: { message } }) {
  const { taskName, taskTitle } = parseTitle({ task })
  return `${red.bold(taskName)}
${dim(taskTitle)}

${message}`
}

// Parse `taks.title` using ' - ' delimiter
const parseTitle = function({ task: { title } }) {
  const delimiterIndex = title.indexOf(TITLE_DELIMITER)
  if (delimiterIndex === -1) {
    return { taskName: title, taskTitle: '' }
  }

  const taskName = title.slice(0, delimiterIndex)
  const taskTitle = title.slice(delimiterIndex + TITLE_DELIMITER.length)
  return { taskName, taskTitle }
}

// Delimiter between taskName - title
const TITLE_DELIMITER = ' - '

module.exports = {
  getHeader,
}
