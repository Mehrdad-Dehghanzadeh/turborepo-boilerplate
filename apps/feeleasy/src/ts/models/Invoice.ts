import { BooleanPlus } from '@enums/BooleanPlus'
import { PartyType } from '@enums/PartyType'
import { PartyCategory } from '@enums/PartyCategory'
import { VoucherTypes } from '@enums/VoucherTypes'

export interface InvoiceDto {
  type: 'LEASING_AGENT_OFFERING'
  items: ItemsType[]
  recipient: Recipient
  issuer: Issuer
}

interface Party {
  uuid: string
  name?: string
}

interface Recipient extends Party {
  category: PartyType.INDIVIDUAL
}

interface Issuer extends Party {
  category: PartyCategory.Admin
}

export interface ItemsType {
  type:
    | VoucherTypes.INQUIRY_CHEQUE
    | VoucherTypes.INQUIRY_CREDIT_SCORING
    | VoucherTypes.INQUIRY_KYC
  amount: number
  quantity: number
}

interface PaymentInfo {
  amount: NumberString
  paymentDateTime: string
  referenceNumber: string
  traceNumber: NumberString
}

export interface Invoice extends InvoiceDto {
  uuid: NumberString
  totalAmount: number
  paid: BooleanPlus
  paymentInfo: PaymentInfo
}
