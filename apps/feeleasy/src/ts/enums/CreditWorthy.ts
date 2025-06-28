import { type EnumList } from '@type/Enums'
import { BooleanPlus } from './BooleanPlus'

export const CreditWorthyList: EnumList = [
  {
    value: BooleanPlus.NA,
    title: 'انجام نشده',
    color: 'error'
  },

  {
    value: BooleanPlus.REQUESTED,
    title: 'در انتظار اعتبار سنجی',
    color: 'warning'
  },

  {
    value: BooleanPlus.GRANTED,
    title: 'اعتبار سنجی شده',
    color: 'success'
  },

  {
    value: BooleanPlus.REJECTED,
    title: 'رد شده',
    color: 'error'
  }
]
