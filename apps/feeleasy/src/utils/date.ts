import { formatISO } from 'date-fns'
import { format as formatJalali } from 'date-fns-jalali'

export function format(date: any | string, fullDate?: boolean): string {
  const isoString = formatISO(date)
  return fullDate ? isoString : isoString.split('T')[0]
}

export function utcToJalali(date: string) {
  return date ? formatJalali(new Date(date), 'yyyy/MM/dd') : ''
}

export function utcToJalaliAll(date: string) {
  return date ? formatJalali(new Date(date), 'hh:mm:ss - yyyy/MM/dd') : ''
}
