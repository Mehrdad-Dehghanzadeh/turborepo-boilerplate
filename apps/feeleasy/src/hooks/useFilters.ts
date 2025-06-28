export default function () {
  /**
   * Roune number
   * ***********************************/
  const round = (num: number) => {
    if (num % 1 === 0) {
      return num
    }
    return Math.round(num * 100) / 100
  }

  function getIntegerPart(val: number) {
    if (typeof val === 'number') {
      return val.toString().split('.')[0]
    }
    return val
  }

  /**
   * Seperate number by 3-digit format
   * ***********************************/
  function price(val: number | string | null, currency: string | null = 'ریال') {
    let value: number | string = 0
    if (val) {
      const str: string = val.toString()
      value = str.startsWith('-')
        ? `${str.substring(1).replace(/(.)(?=(.{3})+$)/g, '$1,')}-`
        : str.replace(/(.)(?=(.{3})+$)/g, '$1,')
    }

    return `${value} ${currency}`
  }

  /**
   * Determine file size
   * ***********************************/
  const fileSize = (val: number) => {
    const size = val
    const kilobyte = 1024
    const megabyte = kilobyte * kilobyte

    if (size > megabyte) {
      return round(size / megabyte) + ' مگابایت'
    } else if (size > kilobyte) {
      return round(size / kilobyte) + ' کیلوبایت'
    } else if (size >= 0) {
      return size + ' بایت'
    }

    return 'N/A'
  }

  /**
   * retrun value or havenot String
   * ***********************************/
  const haveNot = (val: unknown) => val ?? 'ندارد'

  return {
    round,
    price,
    fileSize,
    haveNot,
    getIntegerPart
  }
}
