// From 22 to "22nd", etc.
export const numberToCardinal = function(integer) {
  if (!Number.isInteger(integer) || integer < 1) {
    throw new Error(
      `Invalid input '${integer}': it must be an integer greater than 0`,
    )
  }

  const integerA = String(integer)
  const lastDigit = integerA[integerA.length - 1]
  const cardinal = CARDINALS[lastDigit] || DEFAULT_CARDINAL
  return `${integerA}${cardinal}`
}

const CARDINALS = {
  1: 'st',
  2: 'nd',
  3: 'rd',
}

const DEFAULT_CARDINAL = 'th'
