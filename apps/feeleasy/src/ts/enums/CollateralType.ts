import { type EnumList } from '@type/Enums'

export enum CollateralType {
  CERTIFICATE_OF_DEPOSIT = 'CERTIFICATE_OF_DEPOSIT',
  REAL_ESTATE_OR_CHATTEL = 'REAL_ESTATE_OR_CHATTEL',
  STOCK = 'STOCK',
  PROMISSORY_NOTE = 'PROMISSORY_NOTE',
  CHEQUE = 'CHEQUE'
}

export const CollateralTypeList: EnumList = [
  {
    value: CollateralType.CERTIFICATE_OF_DEPOSIT,
    title: 'گواهی سپرده و صندوق',
    color: 'info'
  },

  {
    value: CollateralType.REAL_ESTATE_OR_CHATTEL,
    title: 'دارایی منقول / غیر منقول',
    color: 'info'
  },

  {
    value: CollateralType.STOCK,
    title: 'سهام شرکت های بورسی',
    color: 'info'
  },

  {
    value: CollateralType.PROMISSORY_NOTE,
    title: 'سفته',
    color: 'info'
  },

  {
    value: CollateralType.CHEQUE,
    title: 'چک',
    color: 'info'
  }
]
