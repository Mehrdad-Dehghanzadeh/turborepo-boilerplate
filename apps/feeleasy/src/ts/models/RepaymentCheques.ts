import { BooleanPlus } from '@enums/BooleanPlus'

export interface ApproveChequesInquiry {
  inquiryBatchUuid: NumberString
  type: 'LEASE_REPAYMENT'
}

export default interface repaymentCheque {
  uuid: string
  identity: NumberString
  serial: string
  owner: string
  amount: number
  dueDate: string
  statusHistory: StatusHistory[]
  imagePath: string
  bankInfo: {
    bank: string
    branchCode: NumberString
    branchName: string
  }
}

export interface StatusHistory {
  status: string
  date: string
}

export interface ApproveChequesDto {
  chequesApproved: BooleanPlus
  suppressWarnings?: boolean
}
