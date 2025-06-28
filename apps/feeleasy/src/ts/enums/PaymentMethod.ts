import { type EnumList } from '@type/Enums'

export enum PaymentMethod {
  Cheque = 'CHEQUE',
  DIRECT_DEBIT = 'DIRECT_DEBIT',
  GATEWAY = 'GATEWAY'
}

export const PaymentMethodList: EnumList = [
  {
    value: PaymentMethod.Cheque,
    title: 'چک',
    color: 'info'
  },

  {
    value: PaymentMethod.DIRECT_DEBIT,
    title: 'برداشت از حساب / واریز به حساب',
    color: 'info'
  },

  {
    value: PaymentMethod.GATEWAY,
    title: 'درگاه پرداخت',
    color: 'info'
  }
]
