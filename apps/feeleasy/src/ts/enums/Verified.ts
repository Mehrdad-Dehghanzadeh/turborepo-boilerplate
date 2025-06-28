import { type EnumList } from '@type/Enums'
import { BooleanPlus } from '@enums/BooleanPlus'

export const Verified: EnumList = [
  {
    value: BooleanPlus.REQUESTED,
    title: 'در انتظار تایید',
    color: 'warning'
  },
  {
    value: BooleanPlus.GRANTED,
    title: 'انجام شده',
    color: 'success'
  },

  {
    value: BooleanPlus.REJECTED,
    title: 'رد شده',
    color: 'error'
  },

  {
    value: BooleanPlus.NA,
    title: 'در انتظار احراز هویت',
    color: 'error'
  }
]
