import { checkArgument } from './check.js'

// Retrieve '# SKIP|TODO' directive for plan or asserts
export const getDirective = function({ directive = {} }) {
  checkArgument(directive, 'object')

  const [directiveName, comment] =
    Object.entries(directive).find(isDirective) || []

  if (directiveName === undefined || comment === false) {
    return ''
  }

  const directiveString = ` # ${directiveName.toUpperCase()}`

  const directiveComment = getDirectiveComment({ comment })

  return `${directiveString}${directiveComment}`
}

const isDirective = function([name]) {
  return DIRECTIVES.includes(name.toLowerCase())
}

const DIRECTIVES = ['skip', 'todo']

const getDirectiveComment = function({ comment }) {
  if (comment === undefined || comment === true) {
    return ''
  }

  checkArgument(comment, 'string')

  return ` ${comment}`
}
