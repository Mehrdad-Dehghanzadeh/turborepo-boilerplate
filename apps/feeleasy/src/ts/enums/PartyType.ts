import { type EnumList } from '@type/Enums'

export enum PartyType {
  INDIVIDUAL = 'INDIVIDUAL',
  LEGAL = 'LEGAL'
}

export const PartyTypeList: EnumList = [
  {
    value: PartyType.INDIVIDUAL,
    title: 'حقیقی',
    color: 'info'
  },

  {
    value: PartyType.LEGAL,
    title: 'حقوقی',
    color: 'info'
  }
]
