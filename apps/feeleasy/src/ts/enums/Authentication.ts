import { EnumList } from '@type/Enums'
import { BooleanPlus } from './BooleanPlus'

export const AuthenticationList: EnumList = [
  {
    title: '-',
    value: BooleanPlus.NA,
    color: 'default'
  },

  {
    title: 'در حال انجام',
    value: BooleanPlus.REQUESTED,
    color: 'warning'
  },

  {
    title: 'انجام شده',
    value: BooleanPlus.GRANTED,
    color: 'success'
  },

  {
    title: 'انجام نشده',
    value: BooleanPlus.REJECTED,
    color: 'error'
  },

  {
    title: 'برگشت جهت ویرایش',
    value: BooleanPlus.RETURNED,
    color: 'error'
  },

  {
    title: 'تایید شده توسط کاربر',
    value: BooleanPlus.CONFIRMED,
    color: 'success'
  },

  {
    title: 'رد شده توسط کاربر',
    value: BooleanPlus.WITHDREW,
    color: 'error'
  },

  {
    title: 'لغو شده',
    value: BooleanPlus.CANCELED,
    color: 'error'
  }
]
