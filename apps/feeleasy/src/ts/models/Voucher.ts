import { VoucherTypes } from '@enums/VoucherTypes'

export interface Voucher {
  recipientUuid: NumberString
  type: VoucherTypes.INQUIRY_CREDIT_SCORING | VoucherTypes.INQUIRY_KYC
  remainingUses: number
  expiryDate: Date | null
}

export interface VoucherQueryParams {
  available: boolean
}
