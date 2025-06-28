import { Frequency } from '@enums/Frequency'
import { BooleanPlus } from '@enums/BooleanPlus'
import { PaymentStatus } from '@enums/PaymentStatus'
import { DueStatus } from '@enums/DueStatus'

export default interface Repayments {
  uuid?: NumberString
  totalRepaymentAmount: string | number | any
  totalRemainingAmount: string | number | any
  interestRate: NumberString
  lateFeeRate: NumberString
  repaymentSchedule: RepaymentSchedule
  installments: Installments[]
  chequesApproved: BooleanPlus
}

interface RepaymentSchedule {
  term: NumberString
  paymentFrequency: Frequency | any
}

export interface Installments {
  uuid: NumberString
  order: number
  amount: number
  remainingAmount: number
  dueDate: string
  paymentStatus: PaymentStatus
  dueStatus: DueStatus
}
