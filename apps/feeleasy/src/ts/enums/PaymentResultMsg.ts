import { type EnumList } from '@type/Enums'

export enum PaymentResultMsg {
  OK = 'OK',
  FAILED = 'FAILED',
  CANCELD_BY_USER = 'CANCELD_BY_USER',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS'
}

export const PaymentResultMsgList: EnumList = [
  {
    value: PaymentResultMsg.OK,
    title: 'پرداخت موفقیت آمیز',
    color: 'success'
  },

  {
    value: PaymentResultMsg.CANCELD_BY_USER,
    title: 'پرداخت توسط کاربر لغو شد',
    color: 'error'
  },

  {
    value: PaymentResultMsg.FAILED,
    title: 'پرداخت انجام نشد',
    color: 'error'
  },

  {
    value: PaymentResultMsg.INVALID_PARAMETERS,
    title: 'خطا در اطلاعات ارسال شده',
    color: 'error'
  }
]
