import { BooleanPlus } from '@enums/BooleanPlus'
import { type EnumList } from '@type/Enums'

export const CreditPay: EnumList = [
  {
    value: BooleanPlus.REQUESTED,
    title: 'در انتظار پرداخت اعتباری',
    color: 'warning'
  },

  {
    value: BooleanPlus.GRANTED,
    title: 'پرداخت اعتباری انجام شده',
    color: 'success'
  },

  {
    value: BooleanPlus.REJECTED,
    title: 'پرداخت رد شده',
    color: 'error'
  },

  {
    value: BooleanPlus.NA,
    title: 'نامشخص',
    color: 'default'
  }
]
