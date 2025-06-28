import { type EnumList } from '@type/Enums'

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID'
}

export const PaymentStatusList: EnumList = [
  {
    value: PaymentStatus.PAID,
    title: 'پرداخت شده',
    color: 'success'
  },

  {
    value: PaymentStatus.UNPAID,
    title: 'پرداخت نشده',
    color: 'error'
  },

  {
    value: PaymentStatus.PARTIALLY_PAID,
    title: 'قسمتی پرداخت شده',
    color: 'warning'
  }
]
