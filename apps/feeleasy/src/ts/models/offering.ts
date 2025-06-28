import { VoucherTypes } from '@enums/VoucherTypes'

export interface Offerings {
  code:
    | any
    | VoucherTypes.INQUIRY_CHEQUE
    | VoucherTypes.INQUIRY_CREDIT_SCORING
    | VoucherTypes.INQUIRY_KYC
  price: number
  description: string
}
