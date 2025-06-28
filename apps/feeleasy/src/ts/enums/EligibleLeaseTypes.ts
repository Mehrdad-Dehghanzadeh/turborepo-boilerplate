import { type EnumList } from '@type/Enums'

export enum EligibleLeaseTypes {
  Capital = 'CAPITAL',
  RentToOwn = 'RENT_TO_OWN'
}

export const EligibleLeaseTypesList: EnumList = [
  {
    value: EligibleLeaseTypes.Capital,
    title: 'خرید اقساطی',
    color: 'info'
  },

  {
    value: EligibleLeaseTypes.RentToOwn,
    title: 'اجاره به شرط تملیک',
    color: 'info'
  }
]
