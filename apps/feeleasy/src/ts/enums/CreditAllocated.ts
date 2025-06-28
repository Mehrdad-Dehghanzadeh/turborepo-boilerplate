import { EnumList } from '@type/Enums'
import { BooleanPlus } from './BooleanPlus'

export const CreditAllocatedList: EnumList = [
  {
    value: BooleanPlus.NA,
    title: 'در انتظار تکمیل و تایید مدارک',
    color: 'warning'
  },

  {
    value: BooleanPlus.REQUESTED,
    title: 'در انتظار تخصیص',
    color: 'warning'
  },

  {
    value: BooleanPlus.GRANTED,
    title: 'تخصیص داده شده',
    color: 'success'
  },

  {
    value: BooleanPlus.REJECTED,
    title: 'تخصیص داده نشده',
    color: 'error'
  }
]
