export const convertPersianToEnglishNumbers = (input: string): string => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  return input
    .split('')
    .map((char) => {
      const index = persianNumbers.indexOf(char)
      return index !== -1 ? englishNumbers[index] : char
    })
    .join('')
}

export function convertNumber(str: string): string {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]

  if (typeof str === 'string') {
    for (let i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], `${i}`).replace(arabicNumbers[i], `${i}`)
    }
  }
  return str
}

export const allowOnlyNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const ischar = /^[A-Za-z]$/.test(e.key)
  const isTypingCharacter = e.key.length === 1 && !e.ctrlKey && !e.metaKey
  if (ischar && isTypingCharacter) {
    e.preventDefault()
  }
}

export const allowOnlyNumericPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  const pasted = e.clipboardData.getData('Text')
  if (!/^\d+$/.test(pasted)) {
    e.preventDefault()
  }
}
