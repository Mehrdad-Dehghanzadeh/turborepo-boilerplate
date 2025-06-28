import { type EnumList } from '@type/Enums'

export enum PartyCategory {
  Leasing = 'LEASING_COMPANY',
  Admin = 'LEASING_AGENT',
  Customer = 'CUSTOMER',
  Shop = 'SHOP'
}

export const PartyCategoryList: EnumList = [
  {
    value: PartyCategory.Leasing,
    title: 'لیزینگ',
    color: 'info'
  },

  {
    value: PartyCategory.Admin,
    title: 'ادمین',
    color: 'info'
  },

  {
    value: PartyCategory.Customer,
    title: 'مشتری',
    color: 'info'
  },
  {
    value: PartyCategory.Shop,
    title: 'فروشنده',
    color: 'info'
  }
]
