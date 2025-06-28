import { type EnumList } from '@type/Enums'

export enum SettlementMethod {
  CHEQUE = 'CHEQUE',
  SATNA = 'SATNA',
  PAYA = 'PAYA'
}

export const SettlementMethodList: EnumList = [
  {
    value: SettlementMethod.CHEQUE,
    title: 'چک',
    color: 'info'
  },

  {
    value: SettlementMethod.SATNA,
    title: 'ساتنا',
    color: 'info'
  },

  {
    value: SettlementMethod.PAYA,
    title: 'پایا',
    color: 'info'
  }
]
