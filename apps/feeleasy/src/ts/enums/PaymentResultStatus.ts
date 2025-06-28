import { type EnumList } from '@type/Enums'

export enum PaymentResultStatus {
  NULL = 'NULL',
  INITIALIZED = 'INITIALIZED',
  REQUESTED = 'REQUESTED',
  RETURNED_FOR_UPDATE = 'RETURNED_FOR_UPDATE',
  CANCELED = 'CANCELED',
  GRANTED = 'GRANTED',
  REJECTED = 'REJECTED',
  WITHDREW = 'WITHDREW',
  CONFIRMED = 'CONFIRMED'
}

export const PaymentResultStatusList: EnumList = [
  {
    title: 'در انتظار پرداخت',
    value: PaymentResultStatus.REQUESTED,
    color: 'warning'
  },

  {
    title: 'برگشت جهت ویرایش',
    value: PaymentResultStatus.RETURNED_FOR_UPDATE,
    color: 'error'
  },

  {
    title: 'انصراف پرداخت کننده',
    value: PaymentResultStatus.CANCELED,
    color: 'error'
  },

  {
    title: 'انجام شده',
    value: PaymentResultStatus.GRANTED,
    color: 'success'
  },

  {
    title: 'رد شده',
    value: PaymentResultStatus.REJECTED,
    color: 'error'
  },

  {
    title: 'برگشت خورده',
    value: PaymentResultStatus.WITHDREW,
    color: 'warning'
  },

  {
    title: 'تایید شده',
    value: PaymentResultStatus.CONFIRMED,
    color: 'success'
  }
]
