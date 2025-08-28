import validations from './fa/validations'
import control from './fa/validations'
import statusMessage from './fa/validations'

const messages = {
  validations,
  control,
  statusMessage
}

const propsOfMessages = Object.keys(messages)

function checkPattern(str: string) {
  if (!str || typeof str != 'string' || !/\w+\.\w+/.test(str)) {
    throw 'input pattern is wrong'
  }

  const firstKey = str.split('.')[0]
  if (!firstKey || !propsOfMessages.includes(firstKey)) {
    throw 'your property is not valid'
  }
}

function findValue(keysOfStr: string[]) {
  const value = keysOfStr.reduce(
    (accumulator: TData, currentValue: string) => accumulator?.[currentValue] || null,
    messages
  )

  if (value && ['string', 'object'].includes(typeof value)) {
    return value
  } else {
    throw 'not found'
  }
}

function sensitizeString(str: string) {
  return str.replaceAll(/[\[\]\\]/g, '')
}

export function $t(str: string) {
  try {
    checkPattern(str)
    const s = sensitizeString(str)
    const keysOfStr = s.split('.')
    const value = findValue(keysOfStr)

    return value
  } catch (e) {
    console.error(e)
  }
}
