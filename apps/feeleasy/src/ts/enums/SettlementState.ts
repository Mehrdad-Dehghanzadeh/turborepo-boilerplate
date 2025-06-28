import { type EnumList } from '@type/Enums'

export enum SettlementStates {
  pending = 'PENDING',
  paid = 'PAID',
  waitingToSettle = 'WAITING_TO_SETTLE',
  settled = 'SETTLED'
}

export const SettlementStateList: EnumList = [
  {
    value: SettlementStates.pending,
    title: 'در انتظار امضای قرارداد تسهیلات',
    color: 'warning'
  },

  {
    value: SettlementStates.paid,
    title: 'پرداخت شده',
    color: 'success'
  },

  {
    value: SettlementStates.waitingToSettle,
    title: 'در انتظار تسویه',
    color: 'warning'
  },

  {
    value: SettlementStates.settled,
    title: 'تسویه شده',
    color: 'success'
  }
]
