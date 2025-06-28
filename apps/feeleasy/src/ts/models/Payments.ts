import { SettlementMethod } from '@enums/SettlementMethod'
import { SettlementStates } from '@enums/SettlementState'
import { PaymentType } from '@enums/PaymentType'
import { LeaseDto } from './Lease'
import { Order } from './Orders'

export default interface Payments {
  uuid: string
  amount: string
  lease: LeaseDto
  order: Order
  type: PaymentType
  status: SettlementStates
  settlementInfos: SettlementInfos[]
  totalSettlementAmount: string
}

export interface SettlementInfos {
  amount: NumberString
  dateTime: Date | any
  description: string
  destination: string
  destinationIdentity: string
  settlementMethod: SettlementMethod
  source: string
  sourceIdentity: string
  trackingNumber: NumberString
}
