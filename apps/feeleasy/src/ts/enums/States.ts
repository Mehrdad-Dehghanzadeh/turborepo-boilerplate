import { BooleanPlus } from '@enums/BooleanPlus'
import { type EnumList } from '@type/Enums'

export const States: EnumList = [
  {
    value: BooleanPlus.NA,
    title: 'در انتظار ارسال',
    color: 'info'
  },

  {
    value: BooleanPlus.REQUESTED,
    title: 'در انتظار تایید',
    color: 'warning'
  },

  {
    value: BooleanPlus.RETURNED,
    title: 'برگشت جهت ویرایش',
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
    value: BooleanPlus.CONFIRMED,
    title: 'تایید شده',
    color: 'success'
  },

  {
    value: BooleanPlus.CANCELED,
    title: 'لغو شده',
    color: 'error'
  }
]
