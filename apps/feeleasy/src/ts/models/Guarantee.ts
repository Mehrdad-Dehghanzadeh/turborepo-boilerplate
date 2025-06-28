import { BooleanPlus } from '@enums/BooleanPlus'

export default interface Guarantee {
  uuid: string
  leaseUuid: string
  guarantorDocuments: CollateralsOrDocuments[]
  applicantCollaterals: CollateralsOrDocuments[]
  approved: string | any
}

export interface CollateralsOrDocuments {
  id: string
  type: string
  amount: number
  referenceUuid: string
}

export interface GuarantorDocuments extends CollateralsOrDocuments {}

export interface ApplicantCollaterals extends CollateralsOrDocuments {}

export interface Cheque {
  uuid: string
  identity: string
  serial: string
  owner: string
  amount: number
  dueDate: string
  bankInfo: {
    bank: string
    branchCode: NumberString
    branchName: string
  }
  statusHistory: StatusHistory[]
  imagePath: null | string
}

export interface StatusHistory {
  status: string
  date: null | string | Date
}

export interface ApproveDto {
  approved: BooleanPlus.GRANTED
}

export interface ReturnForUpdateDto {
  approved: BooleanPlus.RETURNED
}

export interface SendForApproveDto {
  approved: BooleanPlus.REQUESTED
}

export interface ApproveInquiryDto {
  inquiryUuid: string
}

export interface InquiryParams {
  subjectUuid: string
  secondaryId: string
}
