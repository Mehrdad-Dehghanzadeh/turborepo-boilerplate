import { BooleanPlus } from '@enums/BooleanPlus'
import { Frequency } from '@enums/Frequency'

interface LeasingProtocol {
  name: string
  uuid: string | number
}

interface Lessee {
  name: string
  uuid: string | number
}

interface Lessor {
  name: string
  uuid: string | number
}

interface RepaymentSchedule {
  term: string | number
  paymentFrequency: Frequency | any
}

export interface LeaseDto {
  uuid: string | number
  allocatedCredit: string | number
  availableCredit: string | number
  interest: string | number
  repaymentSchedule: RepaymentSchedule
  createDate: string | Date | any
  leasingProtocol: LeasingProtocol
  lessor: Lessor
  lessee: Lessee
  contractUuid: string
}

export interface LeaseUpdateDto {
  amount: number | NumberString
  interest: number | NumberString
  repaymentSchedule: RepaymentSchedule
}

export interface ApproveDto {
  creditAllocated: BooleanPlus
}
