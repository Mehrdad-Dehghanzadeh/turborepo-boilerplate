import { BooleanPlus } from '@enums/BooleanPlus'

export interface LeaseRequestsDto {
  amount: number | string
  term: number | string
  interest: number | string
  paymentFrequency: string
  leasingProtocolUuid: string
  userUuid: string
  requiredDocumentInfo: {
    amountThreshold: string | number
    description: string
    requiredDocuments: string[]
  }
  selectedCategoryCode: string
}

export interface LeaseRequestsApproveDto {
  approved: boolean
  documentsApproved: BooleanPlus
}

export interface RequiredCollaterals {
  type: string
  guaranteeFactor: NumberString
}

export interface RequiredDocuments {
  amountThreshold: string
  requiredDocuments: string[]
  description: string
}
