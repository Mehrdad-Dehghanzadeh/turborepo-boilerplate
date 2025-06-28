import { type EnumList } from '@type/Enums'

export enum GuaranteeDocumentType {
  Cheque = 'CHEQUE',
  BankGuarantee = 'BANK_GUARANTEE'
}

export const GuaranteeDocumentTypeList: EnumList = [
  {
    value: GuaranteeDocumentType.Cheque,
    title: 'چک',
    color: 'info'
  },

  {
    value: GuaranteeDocumentType.BankGuarantee,
    title: ' ضمانت نامه بانکی',
    color: 'info'
  }
]
