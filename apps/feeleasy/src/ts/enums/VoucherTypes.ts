import { type EnumList } from '@type/Enums'

export enum VoucherTypes {
  INQUIRY_CREDIT_SCORING = 'INQUIRY_CREDIT_SCORING',
  INQUIRY_KYC = 'INQUIRY_KYC',
  INQUIRY_CHEQUE = 'INQUIRY_CHEQUE'
}

export const VoucherTypesList: EnumList = [
  {
    title: 'اعتبار سنجی',
    value: VoucherTypes.INQUIRY_CREDIT_SCORING,
    color: 'success'
  },

  {
    title: 'احراز هویت',
    value: VoucherTypes.INQUIRY_KYC,
    color: 'info'
  },

  { title: 'استعلام صحت چک', value: VoucherTypes.INQUIRY_CHEQUE, color: 'primary' }
]
