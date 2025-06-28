import { BooleanPlus } from '@enums/BooleanPlus'
import { type EnumList } from '@type/Enums'

export const DocumentProvided: EnumList = [
  {
    value: BooleanPlus.NA,
    title: 'در انتظار بارگذاری',
    color: 'warning'
  },

  {
    value: BooleanPlus.REQUESTED,
    title: 'در انتظار تایید ',
    color: 'warning'
  },

  {
    value: BooleanPlus.GRANTED,
    title: 'تایید شده',
    color: 'success'
  },

  {
    value: BooleanPlus.REJECTED,
    title: 'رد شده',
    color: 'error'
  },

  {
    value: BooleanPlus.RETURNED,
    title: 'برگشت جهت ویرایش',
    color: 'error'
  }
]
