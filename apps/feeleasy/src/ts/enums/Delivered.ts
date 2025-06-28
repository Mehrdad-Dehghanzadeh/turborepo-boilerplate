import { BooleanPlus } from '@enums/BooleanPlus'
import { type EnumList } from '@type/Enums'

export const Delivered: EnumList = [
  {
    value: BooleanPlus.REQUESTED,
    title: 'در انتظار تحویل',
    color: 'warning'
  },

  {
    value: BooleanPlus.GRANTED,
    title: 'تحویل داده شده',
    color: 'success'
  },

  {
    value: BooleanPlus.REJECTED,
    title: 'تحویل نشده',
    color: 'error'
  },

  {
    value: BooleanPlus.NA,
    title: 'نامشخص',
    color: 'default'
  }
]
