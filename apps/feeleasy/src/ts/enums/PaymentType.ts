import { type EnumList } from '@type/Enums'

export enum PaymentType {
  Credit = 'CREDIT',
  Cash = 'CASH'
}

export const PaymentTypeList: EnumList = [
  {
    value: PaymentType.Credit,
    title: 'اعتباری',
    color: 'info'
  },

  {
    value: PaymentType.Cash,
    title: 'نقدی',
    color: 'info'
  }
]
