import { type EnumList } from '@type/Enums'

export enum Durations {
  ZeroDays = 'ZERO_DAYS',
  OneDay = 'ONE_DAY',
  OneWeek = 'ONE_WEEK',
  OneMonth = 'ONE_MONTH',
  ThreeMonths = 'THREE_MONTHS',
  SixMonths = 'SIX_MONTHS'
}

export const DurationsList: EnumList = [
  {
    value: Durations.ZeroDays,
    title: 'در لحظه قرارداد',
    color: 'info'
  },

  {
    value: Durations.OneDay,
    title: 'یک روز',
    color: 'info'
  },

  {
    value: Durations.OneWeek,
    title: 'یک هفته',
    color: 'info'
  },

  {
    value: Durations.OneMonth,
    title: 'یک ماه',
    color: 'info'
  },

  {
    value: Durations.ThreeMonths,
    title: 'سه ماه',
    color: 'info'
  },

  {
    value: Durations.SixMonths,
    title: 'شش ماه',
    color: 'info'
  }
]
