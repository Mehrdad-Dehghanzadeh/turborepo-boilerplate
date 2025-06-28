import { type EnumList } from '@type/Enums'

export enum Frequency {
  MONTHLY = 'MONTHLY',
  BIMONTHLY = 'BIMONTHLY',
  QUARTERLY = 'QUARTERLY',
  TRIMESTER = 'TRIMESTER',
  SEMIANNUAL = 'SEMIANNUAL'
}

export const FrequencyList: EnumList = [
  {
    value: Frequency.MONTHLY,
    title: 'ماهانه',
    color: 'info',
    key: 1
  },

  {
    value: Frequency.BIMONTHLY,
    title: 'دو ماه یکبار',
    color: 'info',
    key: 2
  },

  {
    value: Frequency.QUARTERLY,
    title: 'سه ماه یکبار',
    color: 'info',
    key: 3
  },

  {
    value: Frequency.TRIMESTER,
    title: 'چهار ماه یکبار',
    color: 'info',
    key: 4
  },

  {
    value: Frequency.SEMIANNUAL,
    title: 'شش ماه یکبار',
    color: 'info',
    key: 6
  }
]
