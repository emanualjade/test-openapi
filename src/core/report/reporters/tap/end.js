const serializer = require('./serializer')

// Ends TAP v13 output
// Write # tests|pass|fail|skip|ok comments at the end
const end = function(tasks, { options: { tap } }) {
  return serializer.end(tap)
}

module.exports = {
  end,
}
